import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from 'react-modal';
import './Dashboard.css';  // Import the new CSS

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        createdAt: new Date(),
        userId: currentUser.uid
      });
      setNewTask({ title: '', description: '', status: 'To Do' });
      setAddModalOpen(false);
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const handleTaskAction = (task, action) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleUpdateTask = async () => {
    try {
      const taskRef = doc(db, 'tasks', selectedTask.id);
      await updateDoc(taskRef, selectedTask);
      setTaskModalOpen(false);
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const taskRef = doc(db, 'tasks', selectedTask.id);
      await deleteDoc(taskRef);
      setTaskModalOpen(false);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    
    const newStatus = destination.droppableId;
    const taskRef = doc(db, 'tasks', draggableId);
    await updateDoc(taskRef, { status: newStatus });
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Task Manager Dashboard</h1>
      
      <button onClick={() => setAddModalOpen(true)}>Add Task</button>

      <input
        type="text"
        placeholder="Search tasks by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

<DragDropContext onDragEnd={onDragEnd}>
  <div className="columns-container">
    {columns.map((column) => (
      <Droppable key={column} droppableId={column}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="column">
            <h2>{column}</h2>
            {tasks
              .filter(
                (task) =>
                  task.status === column &&
                  task.userId === currentUser.uid &&
                  task.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-card"
                    >
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <div className="task-actions">
                        <button className="btn-view" onClick={() => handleTaskAction(task, 'view')}>
                          View
                        </button>
                        <button className="btn-edit" onClick={() => handleTaskAction(task, 'edit')}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleTaskAction(task, 'delete')}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ))}
  </div>
</DragDropContext>


      {/* Add Task Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={() => setAddModalOpen(false)} className="react-modal-content" overlayClassName="react-modal-overlay">
        <h2>Add Task</h2>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            {columns.map((column) => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
          <button type="submit">Add Task</button>
        </form>
      </Modal>

      {/* Task Action Modal */}
      <Modal isOpen={isTaskModalOpen} onRequestClose={() => setTaskModalOpen(false)} className="react-modal-content" overlayClassName="react-modal-overlay">
        <h2>Task Details</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={selectedTask?.title || ''}
          onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Task Description"
          value={selectedTask?.description || ''}
          onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
        />
        <select
          value={selectedTask?.status || ''}
          onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
        >
          {columns.map((column) => (
            <option key={column} value={column}>{column}</option>
          ))}
        </select>
        <button  className="btn-view-modal" onClick={handleUpdateTask}>Update Task</button>
        <button className="btn-view-modal"  onClick={handleDeleteTask}>Delete Task</button>
      </Modal>
    </div>
  );
};

export default Dashboard;
