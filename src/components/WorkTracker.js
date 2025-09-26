import { reactive, ref, computed } from 'vue'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance

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
export async function addTask(memberId, taskData) {
    const task = {
        memberId,
        title: taskData.title,
        description: taskData.description || '',
        dueBy: taskData.dueDate || new Date(), // Store as Date object for Firestore
        priority: taskData.priority || 'Medium',
        status: taskData.status || 'Pending',
        createdAt: new Date(),
        assignedBy: taskData.assignedBy || 'System'
    };

    // Log what we're storing for debugging
    console.log("Adding task with dueBy:", task.dueBy);

    const docRef = await addDoc(collection(db, "tasks"), task); // Add to Firestore
    return { id: docRef.id, ...task }; // Return the task with Firestore document ID
}

export async function addMeeting(meetingData) {
    // Create the meeting object without the ID field
    const meeting = {
        title: meetingData.title,
        description: meetingData.description || '',
        startDate: meetingData.startDate,
        endDate: meetingData.endDate,
        attendees: meetingData.attendees || [],
        location: meetingData.location || 'Virtual',
        createdAt: new Date(),
        createdBy: meetingData.createdBy || 'System'
    };

    // Log what we're storing for debugging
    console.log("Adding meeting:", meeting);

    const docRef = await addDoc(collection(db, "meetings"), meeting); // Add to Firestore
    return { id: docRef.id, ...meeting }; // Return the meeting with Firestore document ID
}

export async function updateTaskStatus(taskId, status) {
  try {
    // First update the local state
    const task = taskState.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      
      // Then update in Firestore
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: status });
      console.log(`Task ${taskId} status updated to ${status}`);
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}

export async function deleteTask(taskId) {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "tasks", taskId));
    
    // Also remove from local state
    const index = taskState.tasks.findIndex(t => t.id === taskId);
    if (index > -1) {
      taskState.tasks.splice(index, 1);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export async function deleteMeeting(meetingId) {
  try {
    console.log("Deleting meeting with ID:", meetingId);
    
    // Delete from Firestore
    await deleteDoc(doc(db, "meetings", meetingId));
    
    // Also remove from local state
    const index = taskState.meetings.findIndex(m => m.id === meetingId);
    if (index > -1) {
      taskState.meetings.splice(index, 1);
      console.log("Meeting removed from local state");
    } else {
      console.warn("Meeting not found in local state");
    }
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
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
  return taskState.meetings.filter(meeting => {
    try {
      // Handle Firestore timestamp or string date format
      const startDate = typeof meeting.startDate === 'object' && meeting.startDate.toDate ? 
          meeting.startDate.toDate() : new Date(meeting.startDate);
      return startDate > now;
    } catch (error) {
      console.error("Error comparing meeting date:", meeting.startDate, error);
      return false;
    }
  }).sort((a, b) => {
    try {
      // Handle Firestore timestamp or string date format
      const dateA = typeof a.startDate === 'object' && a.startDate.toDate ? 
          a.startDate.toDate() : new Date(a.startDate);
      const dateB = typeof b.startDate === 'object' && b.startDate.toDate ? 
          b.startDate.toDate() : new Date(b.startDate);
      return dateA - dateB;
    } catch (error) {
      console.error("Error sorting meeting dates:", error);
      return 0;
    }
  });
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
      start: task.dueBy,
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

// Fetch functions
export async function fetchTasks() {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Ensure dueBy is properly formatted when coming from Firestore
        const task = { 
            id: doc.id, 
            ...data 
        };
        
        tasks.push(task);
    });
    
    console.log("Fetched tasks:", tasks); // Debug log to see what we're getting
    taskState.tasks = tasks; // Update the reactive state
}

export async function fetchMeetings() {
    const querySnapshot = await getDocs(collection(db, "meetings"));
    const meetings = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Ensure proper formatting when coming from Firestore
        const meeting = { 
            id: doc.id, 
            ...data 
        };
        
        meetings.push(meeting);
    });
    
    console.log("Fetched meetings:", meetings); // Debug log to see what we're getting
    taskState.meetings = meetings; // Update the reactive state
}