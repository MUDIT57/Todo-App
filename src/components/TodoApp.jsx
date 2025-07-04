import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit3, Check, X, Filter, Calendar, Flag, Tag, Moon, Sun, Archive, Clock, Target } from 'lucide-react';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project proposal', completed: false, priority: 'high', category: 'work', createdAt: new Date().toISOString(), dueDate: '2024-07-10' },
    { id: 2, text: 'Buy groceries', completed: false, priority: 'medium', category: 'personal', createdAt: new Date().toISOString(), dueDate: '2024-07-08' },
    { id: 3, text: 'Learn React hooks', completed: true, priority: 'low', category: 'learning', createdAt: new Date().toISOString(), dueDate: null }
  ]);
  
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodoCategory, setNewTodoCategory] = useState('personal');
  const [newTodoPriority, setNewTodoPriority] = useState('medium');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [view, setView] = useState('kanban');
  
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const categories = [
    { id: 'work', name: 'Work', color: 'bg-blue-500', icon: '💼' },
    { id: 'personal', name: 'Personal', color: 'bg-green-500', icon: '🏠' },
    { id: 'learning', name: 'Learning', color: 'bg-purple-500', icon: '📚' },
    { id: 'health', name: 'Health', color: 'bg-red-500', icon: '❤️' },
    { id: 'hobby', name: 'Hobby', color: 'bg-yellow-500', icon: '🎨' }
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: 'text-green-400', icon: '🔽' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-400', icon: '🔸' },
    { id: 'high', name: 'High', color: 'text-red-400', icon: '🔺' }
  ];

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: newTodoPriority,
        category: newTodoCategory,
        createdAt: new Date().toISOString(),
        dueDate: newTodoDueDate || null
      };
      setTodos([...todos, todo]);
      setNewTodo('');
      setNewTodoDueDate('');
      setShowAddForm(false);
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getCategoryData = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getPriorityData = (priorityId) => {
    return priorities.find(pri => pri.id === priorityId) || priorities[1];
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && !todo.completed) ||
                         (filter === 'completed' && todo.completed);
    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
    
    return matchesSearch && matchesFilter && matchesCategory && matchesPriority;
  });

  const handleDragStart = (e, todo) => {
    setDraggedItem(todo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedItem) {
      const shouldComplete = targetStatus === 'completed';
      setTodos(todos.map(todo => 
        todo.id === draggedItem.id ? { ...todo, completed: shouldComplete } : todo
      ));
      setDraggedItem(null);
    }
  };

  const KanbanView = () => {
    const activeTodos = filteredTodos.filter(todo => !todo.completed);
    const completedTodos = filteredTodos.filter(todo => todo.completed);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'active')}
        >
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Active Tasks ({activeTodos.length})
          </h3>
          <div className="space-y-3">
            {activeTodos.map(todo => (
              <TodoCard key={todo.id} todo={todo} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>
        
        <div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'completed')}
        >
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Completed ({completedTodos.length})
          </h3>
          <div className="space-y-3">
            {completedTodos.map(todo => (
              <TodoCard key={todo.id} todo={todo} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TodoCard = ({ todo, onDragStart }) => {
    const category = getCategoryData(todo.category);
    const priority = getPriorityData(todo.priority);
    const overdue = isOverdue(todo.dueDate);

    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, todo)}
        className={`group p-4 rounded-lg border transition-all duration-200 cursor-move hover:shadow-lg hover:scale-102 ${
          todo.completed 
            ? 'bg-slate-700/50 border-slate-600 opacity-75' 
            : 'bg-slate-800/70 border-slate-600 hover:border-slate-500'
        } ${overdue && !todo.completed ? 'ring-2 ring-red-500/50' : ''}`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleComplete(todo.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              todo.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-slate-400 hover:border-green-400'
            }`}
          >
            {todo.completed && <Check className="w-3 h-3" />}
          </button>
          
          <div className="flex-1 min-w-0">
            {editingId === todo.id ? (
              <div className="flex gap-2">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                />
                <button onClick={saveEdit} className="text-green-400 hover:text-green-300">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <p className={`font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {todo.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color} text-white`}>
                    {category.icon} {category.name}
                  </span>
                  <span className={`text-xs ${priority.color}`}>
                    {priority.icon} {priority.name}
                  </span>
                  {todo.dueDate && (
                    <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                      <Calendar className="w-3 h-3" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => startEditing(todo.id, todo.text)}
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ListView = () => (
    <div className="space-y-3">
      {filteredTodos.map(todo => (
        <TodoCard key={todo.id} todo={todo} onDragStart={handleDragStart} />
      ))}
    </div>
  );

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && isOverdue(t.dueDate)).length
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2`}>
            ✨ Creative Todo
          </h1>
          <p className="text-slate-400">Organize your life with style</p>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-sm text-slate-400">Total Tasks</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-yellow-400">{stats.active}</div>
            <div className="text-sm text-slate-400">Active</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
            <div className="text-sm text-slate-400">Overdue</div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-64"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                {priorities.map(pri => (
                  <option key={pri.id} value={pri.id}>{pri.icon} {pri.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setView(view === 'kanban' ? 'list' : 'kanban')}
                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors"
              >
                {view === 'kanban' ? '📋 List' : '📋 Kanban'}
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Add New Task</h3>
              <div className="space-y-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addTodo();
                    if (e.key === 'Escape') setShowAddForm(false);
                  }}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTodoCategory}
                    onChange={(e) => setNewTodoCategory(e.target.value)}
                    className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value)}
                    className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    {priorities.map(pri => (
                      <option key={pri.id} value={pri.id}>{pri.icon} {pri.name}</option>
                    ))}
                  </select>
                </div>
                
                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={addTodo}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          {view === 'kanban' ? <KanbanView /> : <ListView />}
        </div>

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No tasks found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || filter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Create your first task to get started'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;