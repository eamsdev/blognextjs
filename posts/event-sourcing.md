---
id: event-sourcing
title: Event Sourcing micro-framework with EventStore DB
description: Create an Event Sourcing micro-framework with Entity Framework Core and EventStore DB
date: 12-03-2023
author: Pete Eamsuwan
readTime: 12 min
meta: Learn how to use create a event sourcing micro framework with Entity Framework Core and EventStore DB.
tags:
  - dotnet
  - Architecture
  - CSharp
thumbnailPath: /post-img/miniess-thumbnail.webp
---

Event sourcing is a powerful pattern for building resilient and scalable applications, especially in use cases where maintaining a complete and accurate audit trail of events is essential. In this article, we will explore the process of building an event sourcing micro framework, using EventStoreDB as the event store.

The following diagram (the dashed lines) is what we will be building.

![Event Sourcing Architecture](/post-img/event-sourcing-0.webp)

## Commands and Events

In event sourcing, commands and events are two different concepts that represent different aspects of a system's behavior.

A command is an encapsulation that represents an intention to change the state of the system. It contains all the necessary information required to perform the mutation, for example parameters needed to execute the change. Commands are typically requested by external actors of the system, such as the user. Commands are generally represented in a language that request something to be done, for example: `CreateUserAccountCommand`.

An event is an encapsulation of the truth/fact that has happened in the system. It describes something that has happened in the past, such as a state mutation. Events are often represented in past tense to indicate it has already happened, for example: `UserAccountCreatedEvent`. One major distinction between a command and event is commands represent an intention, and can be rejected, events represent a fact that has happened.

## Aggregate

In event sourcing (or more accurately, [Domain Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)), an aggregate is a collection of entities that are treated as a single unit of consistency for transactional integrity. It is responsible for enforcing business rules and invariants, and for maintaining a consistent state within the system.

In the context of event sourcing, in response to a command, an aggregate may generate one or more events, which each event representing a state change. These events are persisted in something called the event store, and are often loaded to reconstruct the aggregate to process further commands.

Internally, implementation wise, an aggregate needs to be able to generate events representing state changes, therefore it must maintain and track events that will eventually need to be persisted, as shown below.

```csharp
// BaseAggregateRoot.cs
public abstract class BaseAggregateRoot<TAggregateRoot> : BaseEntity, IAggregateRoot
    where TAggregateRoot : class, IAggregateRoot
{
    private readonly Queue<IDomainEvent> _eventsQueue;

    ...
}
```

An aggregate also needs to store its version, so that the system can detect and resolve conflicts as well as allow the system to track the changes made overtime. An aggregate's version number is incremented each time a new event is added to its event stream.

```csharp
// BaseAggregateRoot.cs
public long Version { get; set; }
```

## Command Processing

Before we can store events using EventStoreDB, we need to be able to handle and process commands. Here I chose to abstract the interaction between the client who issues the command and the aggregate who maintains the consistency boundary using a CommandProcessor object.

```csharp
// CommandProcessor.cs
public class CommandProcessor
{
    ...

    public async Task ProcessAndCommit<T>(ICommand<T> command, CancellationToken cancellationToken) where T : class, IAggregateRoot
    {
        var aggregateRepositoryType = typeof(IAggregateRepository<>)
            .MakeGenericType(typeof(T));

        if (_serviceProvider.GetService(aggregateRepositoryType) is not IAggregateRepository<T> aggregateRepository)
        {
            throw new InvalidOperationException($"AggregateRepository of type {aggregateRepositoryType.FullName} " +
                                                "has not been registered to the IOC");
        }

        var aggregate = await aggregateRepository.LoadAsync(command.StreamId, cancellationToken);
        aggregate ??= BaseAggregateRoot<T>.Create(command.StreamId);

        typeof(IHandleCommand<>)
            .MakeGenericType(command.GetType())
            .GetMethod(nameof(IHandleCommand<ICommand>.Handle))!
            .Invoke(aggregate, new []{ command });

        await aggregateRepository.PersistAsyncAndAwaitProjection(aggregate, cancellationToken);
    }

    ...
}
```

In the above snippet, an instance of an aggregate is retrieved from the aggregate repository. If it is not found, implying that the command is most likely a creation command, then a new instance of an aggregate is created.

Using Reflection and a little help from the marker interface `IHandleCommand<in T> where T : ICommand`, we are able to find the corresponding handler method for the command that we need to process.

Shown below, is an example of how the command handler is implemented.

```csharp
// IHandleCommand.cs
public interface IHandleCommand<in T> where T : ICommand
{
    void Handle(T command);
}

// TodoListAggregateRoot.cs (Implementation Example)
public class TodoListAggregateRoot :
    BaseAggregateRoot<TodoListAggregateRoot>,
    IHandleCommand<TodoListCommands.Create>,
    IHandleEvent<TodoListEvents.Created>,
    ...

    public void Handle(TodoListCommands.Create command)
    {
        if (command.Title.Length == 0)
            throw new DomainException("Title cannot be null or empty for a Todo List");

        RaiseEvent(new TodoListEvents.Created(this, command.Title));
    }
    ...
```

Here you will observe that a command can be rejected if the aggregate deems the input invalid (recall that one of aggregate's roles is to maintain a consistency boundary), otherwise, an event is "raised" via the `RaiseEvent` method, but how does it actually work?

```csharp
// BaseAggregateRoot.cs
protected void RaiseEvent(IDomainEvent @event)
{
    _eventsQueue.Enqueue(@event);

    ApplyEvent(this, @event);

    Version++;
}

private static void ApplyEvent(IEntity aggregate, IDomainEvent @event)
{
    typeof(IHandleEvent<>)
      .MakeGenericType(@event.GetType())
      .GetMethod(nameof(IHandleEvent<IDomainEvent>.Handle))!
      .Invoke(aggregate, new[] { @event });
}

// IHandleEvent.cs
public interface IHandleEvent<in T> where T : IDomainEvent
{
    void Handle(T domainEvent);
}

// TodoListAggregateRoot.cs (Implementation Example)
public void Handle(TodoListEvents.Created domainEvent)
{
    Title = domainEvent.Title;
    TodoItems = new List<TodoItemAggregate>();
}
```

The `RaiseEvent` method does multiple things:

1. Adds the event to queue, so that it can be persisted afterwards
2. Calls the `ApplyEvent`, which via Reflection calls the corresponding event handling method defined on the aggregate. This mutates the state of the aggregate in memory, so subsequent commands in the same scope are handled by the most up-to-date aggregate (scope-wise).
3. Increments the version of the aggregate.

You can probably gather that for the complete implementation, the aggregate will need to implement both the `IHandleCommand`/`IHandleEvent` interfaces for the command and the corresponding event to be handled properly.

## Events Processing/Persistence

In the previous section, we processed commands, mutated the state of the aggregate in-memory and as a result generated some events. These events need to be persisted for them to be considered the source-of-truths.

To do this, we can use the Aggregate Repository, its role is to:

1. Persist the events, via the aggregate
2. Load the latest version of the aggregate

Below is an example of how to implement the persist method of the repository:

```csharp
// AggregateRepository.cs
public class AggregateRepository<TAggregateRoot> : IAggregateRepository<TAggregateRoot>
    where TAggregateRoot : class, IAggregateRoot
{
    private readonly string _streamBaseName;
    private readonly EventStoreDbSerializer _serializer;
    private readonly IEventStoreClient _client;

    public AggregateRepository(IEventStoreClient client, EventStoreDbSerializer serializer)
    {
        _client = client;
        _serializer = serializer;
        _streamBaseName = typeof(TAggregateRoot).Name;
    }

    public async Task<ulong?> PersistAsync(TAggregateRoot aggregateRoot, CancellationToken token)
    {
        if (aggregateRoot is null)
            throw new ArgumentNullException(nameof(aggregateRoot));

        if (!aggregateRoot.Events.Any())
            return null;

        var expectedRevision = StreamRevision.FromInt64(aggregateRoot.Events.First().AggregateVersion - 1);
        var writeResult = await _client.AppendToStreamAsync(
            GetStreamName(aggregateRoot.StreamId),
            expectedRevision,
            aggregateRoot.Events.Select(SerializationHelper.Map),
            cancellationToken: token);

        return writeResult.LogPosition.CommitPosition;
    }
    ...
}
```

The above snippet is pretty straight forward, we are using EventStoreDb's library to interact with the event store. The events from the aggregate are mapped to the DTO definition provided by EventStoreDb. The expected version needs to be included to ensure that any out of order events are rejected in the event of race condition.

## Loading the aggregate aka. hydrating

Persisting the events is good and all, but how do we load them from event store into the aggregate to process further commands? This is called hydration, it refers to the process of reconstructing the current state of an aggregate by replaying a series of events that have occurred in the past.

```csharp
// AggregateRepository.cs
public async Task<TAggregateRoot?> LoadAsync(Guid key, CancellationToken token)
{
    var streamName = GetStreamName(key);
    var eventRecord = await _client.ReadStreamAsync(Direction.Forwards, streamName, StreamPosition.Start, cancellationToken: token);
    var events = eventRecord.Select(x => _serializer.Map(x)).ToList();

    return !events.Any()
        ? null
        : BaseAggregateRoot<TAggregateRoot>.Create(key, events.OrderBy(e => e.AggregateVersion));
}
```

To hydrate the aggregate, we need to load all the past events that have happened to the aggregate. And with a little bit of Reflection magic, we can construct the aggregate, and re-apply all the events that have happened before processing additional commands.

As shown [here](https://github.com/eamsdev/MiniESS/blob/master/MiniESS.Core/Aggregate/BaseAggregateRoot.cs#L35), I'm using a static constructor to aid the subclass construction. After the instance of the aggregate is created, all the events from the stream are applied via the `foreach` loop, and the version is incremented accordingly.

### Projection

In event sourcing, projection refers to a read model or a view that represents a subset of events in the event store. Unlike the events in the event store, which contain a complete history of things that have occurred in the past, a projection or a read model is represented in a form that is optimized for query, hence the name read model.

Implementing projection by integrating with EventStoreDB will involve the following steps:

1. A service, or a background service, subscribes to events that are published to the event store.

```csharp
// EventStoreSubscribeToAll.cs
public async Task SubscribeToAll(CancellationToken cancellationToken)
{
    var checkpoint = await LoadCheckpoint(cancellationToken);

    await _subscriber.SubscribeToAllAsync(
      checkpoint is null ? FromAll.Start : FromAll.After(new Position(checkpoint.Value, checkpoint.Value)),
      HandleEvent,
      subscriptionDropped: (subscription, reason, exception)
          => _logger.LogError("Subscription {SubscriptionId}, has been dropped due to {Reason}, exception: {Exception}",
            subscription.SubscriptionId,
            reason.ToString(), exception?.Message),
      filterOptions: new SubscriptionFilterOptions(EventTypeFilter.ExcludeSystemEvents()),
      cancellationToken: cancellationToken);
}
```

2. When new events are persisted to the event store, the subscriber is notified of the new event, via the provided call back. In the snippet below, the `ProjectionOrchestrator` is responsible for retrieving the correct instance of projection service and calling the `ProjectEventAsync` method.

```csharp
// EventStoreSubscribeToAll.cs
private async Task HandleEvent(
    StreamSubscription _,
    ResolvedEvent resolvedEvent,
    CancellationToken cancellationToken)
{
    var domainEvent = _serializer.Map(resolvedEvent);
    await _projectionOrchestrator.SendToProjector(domainEvent, cancellationToken);
    await _checkpointRepository.Store(SubscriptionId, resolvedEvent.Event.Position.CommitPosition, cancellationToken: cancellationToken);
}

// ProjectionOrchestrator.cs
public async Task SendToProjector(IDomainEvent @event, CancellationToken token)
{
    var aggregateType = @event.GetAssociatedAggregateType();

    using var scope = _serviceProvider.CreateScope();
    var projectorsType = typeof(IProjector<>).MakeGenericType(aggregateType);
    await projector.ProjectEventAsync(@event, token);
}
```

3. Similarly to commands and events handling, the event is pass to the projection handler, which updates the read model.

```csharp
// ProjectorBase.cs
public async Task ProjectEventAsync(IDomainEvent @event, CancellationToken token)
{
    var task = typeof(IProject<>)
        .MakeGenericType(@event.GetType())
        .GetMethod(nameof(IProject<IDomainEvent>.ProjectEvent))!
        .Invoke(this, new object[] { @event, token }) as Task;

    await task!;
}

// ProjectionOrchestrator.cs
public async Task SendToProjector(IDomainEvent @event, CancellationToken token)
{
    var aggregateType = @event.GetAssociatedAggregateType();

    using var scope = _serviceProvider.CreateScope();
    var projectorsType = typeof(IProjector<>).MakeGenericType(aggregateType);
    await projector.ProjectEventAsync(@event, token);
}

// TodoListProjector.cs (Implementation Example)
public class TodoListProjector :
    ProjectorBase<TodoListAggregateRoot>,
    IProject<TodoListEvents.Created>
{
    ...

    public async Task ProjectEvent(TodoListEvents.Created domainEvent, CancellationToken token)
    {
        var todoList = new TodoList
        {
            Id = domainEvent.StreamId,
            Title = domainEvent.Title,
            TodoItems = new List<TodoItem>()
        };

        await Repository<TodoList>().AddAsync(todoList, token);
        await SaveChangesAsync();
    }
    ...
}
```

## Querying the read model

Using EF Core, querying the read model is just as easy as accessing the objects from the `DbContext`. However, if you want to take it a step further and provide a `ReadOnlyDbContext` abstraction, then the following implementation can be used:

```csharp
// ReadonlyDbContext.cs
public class ReadonlyDbContext
{
    private readonly TodoDbContext _dbContext;

    public ReadonlyDbContext(TodoDbContext context)
    {
        _dbContext = context;
    }

    public IQueryable<TEntity> Set<TEntity>() where TEntity : class
    {
        return _dbContext.Set<TEntity>().AsNoTracking();
    }
}
```

## Final Remarks

It's impossible to cover all the code that went into creating this micro-framework in a single article. If you are interested in seeing the entire codebase and this working in action, please check out the source code at [my github repo](https://github.com/eamsdev/MiniESS), it also includes a working example implementing a To-do List application.

## Resources

1. [A Beginner’s Guide to Event Sourcing](https://www.eventstore.com/event-sourcing)
