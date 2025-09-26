import { reactive, ref, computed } from 'vue'

// Team members data
export const teamMembers = [
  { 
    id: 1, 
    name: 'Alyssa Calvillo', 
    role: 'Team Member', 
    major: 'Computer Science',
    color: '#00c6ff'
  },
  { 
    id: 2, 
    name: 'Deepa Kale', 
    role: 'Team Member', 
    major: 'Computer Science',
    color: '#ff7e5f'
  },
  { 
    id: 3, 
    name: 'Wesley Spangler', 
    role: 'Team Leader', 
    major: 'Computer Science',
    color: '#6a11cb'
  },
  { 
    id: 4, 
    name: 'William Paar', 
    role: 'Team Member', 
    major: 'Computer Science',
    color: '#ff6a00'
  }
]

// Task management state
export const taskState = reactive({
  tasks: [],
  meetings: [],
  nextTaskId: 1,
  nextMeetingId: 1
})

// Task management functions
export function addTask(memberId, taskData) {
  const task = {
    id: taskState.nextTaskId++,
    memberId,
    title: taskData.title,
    description: taskData.description || '',
    dueDate: taskData.dueDate,
    priority: taskData.priority || 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
    assignedBy: taskData.assignedBy || 'System'
  }
  
  taskState.tasks.push(task)
  return task
}

export function addMeeting(meetingData) {
  const meeting = {
    id: taskState.nextMeetingId++,
    title: meetingData.title,
    description: meetingData.description || '',
    startDate: meetingData.startDate,
    endDate: meetingData.endDate,
    attendees: meetingData.attendees || [],
    location: meetingData.location || 'Virtual',
    createdAt: new Date().toISOString(),
    type: 'meeting'
  }
  
  taskState.meetings.push(meeting)
  return meeting
}

export function updateTaskStatus(taskId, status) {
  const task = taskState.tasks.find(t => t.id === taskId)
  if (task) {
    task.status = status
  }
}

export function deleteTask(taskId) {
  const index = taskState.tasks.findIndex(t => t.id === taskId)
  if (index > -1) {
    taskState.tasks.splice(index, 1)
  }
}

export function deleteMeeting(meetingId) {
  const index = taskState.meetings.findIndex(m => m.id === meetingId)
  if (index > -1) {
    taskState.meetings.splice(index, 1)
  }
}

export function getTasksByMember(memberId) {
  return taskState.tasks.filter(task => task.memberId === memberId)
}

export function getPendingTasksCount(memberId) {
  return taskState.tasks.filter(task => 
    task.memberId === memberId && task.status === 'pending'
  ).length
}

export function getUpcomingMeetings() {
  const now = new Date()
  return taskState.meetings.filter(meeting => 
    new Date(meeting.startDate) > now
  ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
}

// Calendar event generation
export function generateCalendarEvents() {
  const events = []
  
  // Add tasks as events
  taskState.tasks.forEach(task => {
    const member = teamMembers.find(m => m.id === task.memberId)
    events.push({
      id: `task-${task.id}`,
      title: `${member?.name}: ${task.title}`,
      start: task.dueDate,
      backgroundColor: member?.color || '#gray',
      borderColor: member?.color || '#gray',
      extendedProps: {
        type: 'task',
        taskId: task.id,
        memberId: task.memberId,
        priority: task.priority,
        status: task.status,
        description: task.description
      }
    })
  })
  
  // Add meetings as events
  taskState.meetings.forEach(meeting => {
    events.push({
      id: `meeting-${meeting.id}`,
      title: `Meeting: ${meeting.title}`,
      start: meeting.startDate,
      end: meeting.endDate,
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
      extendedProps: {
        type: 'meeting',
        meetingId: meeting.id,
        attendees: meeting.attendees,
        location: meeting.location,
        description: meeting.description
      }
    })
  })
  
  return events
}

// Utility functions
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getPriorityColor(priority) {
  const colors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336'
  }
  return colors[priority] || colors.medium
}