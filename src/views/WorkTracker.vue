<template>
    <div class="work-tracker-container">
        <!-- Header Section -->
        <div class="header-section">
            <h1 class="section-title">Team Work Tracker & Calendar</h1>
            <div class="action-buttons">
                <button @click="showTaskModal = true" class="btn btn-primary">
                    <span class="icon">📋</span> Add Task
                </button>
                <button @click="showMeetingModal = true" class="btn btn-success">
                    <span class="icon">📅</span> Schedule Meeting
                </button>
                <button @click="toggleView" class="btn btn-secondary">
                    <span class="icon">{{ currentView === 'calendar' ? '📊' : '📅' }}</span>
                    {{ currentView === 'calendar' ? 'Dashboard View' : 'Calendar View' }}
                </button>
            </div>
        </div>

        <!-- Dashboard View -->
        <div v-if="currentView === 'dashboard'" class="dashboard-view">
            <!-- Team Overview -->
            <div class="team-overview">
                <h2 class="section-title">Team Overview</h2>
                <div class="team-cards">
                    <div 
                        v-for="member in teamMembers" 
                        :key="member.id" 
                        class="member-card"
                        :style="{ borderLeft: `4px solid ${member.color}` }"
                    >
                        <div class="member-info">
                            <h3>{{ member.name }}</h3>
                            <p class="role">{{ member.role }}</p>
                            <div class="task-stats">
                                <span class="pending-tasks">
                                    {{ getPendingTasksCount(member.id) }} pending tasks
                                </span>
                            </div>
                        </div>
                        <button 
                            @click="openTaskModalForMember(member.id)" 
                            class="btn btn-sm btn-outline"
                        >
                            Assign Task
                        </button>
                    </div>
                </div>
            </div>

            <!-- Recent Tasks -->
            <div class="recent-tasks">
                <h2>Recent Tasks</h2>
                <div class="task-list">
                    <div 
                        v-for="task in recentTasks" 
                        :key="task.id" 
                        class="task-item"
                        :class="{ 'overdue': isOverdue(task.dueDate) }"
                    >
                        <div class="task-content">
                            <div class="task-header">
                                <span class="task-title">{{ task.title }}</span>
                                <span 
                                    class="priority-badge" 
                                    :style="{ backgroundColor: getPriorityColor(task.priority) }"
                                >
                                    {{ task.priority.toUpperCase() }}
                                </span>
                            </div>
                            <p class="task-assignee">
                                Assigned to: {{ getMemberName(task.memberId) }}
                            </p>
                            <p class="task-due">Due: {{ formatDate(task.dueDate) }}</p>
                        </div>
                        <div class="task-actions">
                            <select 
                                :value="task.status" 
                                @change="updateTaskStatus(task.id, $event.target.value)"
                                class="status-select"
                                :style="{ 
                                    backgroundColor: task.status === 'pending' ? '#575757' : 
                                                    task.status === 'in-progress' ? '#FF9800' : 
                                                    task.status === 'completed' ? '#4CAF50' : '#575757',
                                    color: 'white'
                                }"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <button @click="deleteTask(task.id)" class="btn btn-danger btn-sm">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Upcoming Meetings -->
            <div class="upcoming-meetings">
                <h2>Upcoming Meetings</h2>
                <div class="meeting-list">
                    <div 
                        v-for="meeting in upcomingMeetings"
                        :key="meeting.id" 
                        class="meeting-item"
                    >
                        <div class="meeting-content">
                            <h3>{{ meeting.title }}</h3>
                            <p class="meeting-time">
                                {{ formatDateTime(meeting.startDate) }} - {{ formatDateTime(meeting.endDate) }}
                            </p>
                            <p class="meeting-location">📍 {{ meeting.location }}</p>
                            <div class="attendees">
                                <span>Attendees: </span>
                                <span v-for="attendeeId in meeting.attendees" :key="attendeeId" class="attendee-tag">
                                    {{ getMemberName(attendeeId) }}
                                </span>
                            </div>
                        </div>
                        <button @click="deleteMeeting(meeting.id)" class="btn btn-danger btn-sm">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calendar View -->
        <div v-if="currentView === 'calendar'" class="calendar-view">
            <FullCalendar
                ref="calendar"
                :options="calendarOptions"
            />
        </div>

        <!-- Task Modal -->
        <div v-if="showTaskModal" class="modal-overlay" @click="closeTaskModal">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h2>Add New Task</h2>
                    <button @click="closeTaskModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitTask">
                        <div class="form-group">
                            <label>Task Title *</label>
                            <input 
                                v-model="taskForm.title" 
                                type="text" 
                                required 
                                class="form-control"
                                placeholder="Enter task title"
                            />
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea 
                                v-model="taskForm.description" 
                                class="form-control"
                                rows="3"
                                placeholder="Task description (optional)"
                            ></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Assign To *</label>
                                <select v-model="taskForm.memberId" required class="form-control">
                                    <option value="">Select team member</option>
                                    <option 
                                        v-for="member in teamMembers" 
                                        :key="member.id" 
                                        :value="member.id"
                                    >
                                        {{ member.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Priority</label>
                                <select v-model="taskForm.priority" class="form-control">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Due Date *</label>
                            <input 
                                v-model="taskForm.dueDate" 
                                type="datetime-local" 
                                required 
                                class="form-control"
                            />
                        </div>
                        <div class="modal-actions">
                            <button type="button" @click="closeTaskModal" class="btn btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Meeting Modal -->
        <div v-if="showMeetingModal" class="modal-overlay" @click="closeMeetingModal">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h2>Schedule Meeting</h2>
                    <button @click="closeMeetingModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitMeeting">
                        <div class="form-group">
                            <label>Meeting Title *</label>
                            <input 
                                v-model="meetingForm.title" 
                                type="text" 
                                required 
                                class="form-control"
                                placeholder="Enter meeting title"
                            />
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea 
                                v-model="meetingForm.description" 
                                class="form-control"
                                rows="3"
                                placeholder="Meeting agenda or description"
                            ></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Start Date & Time *</label>
                                <input 
                                    v-model="meetingForm.startDate" 
                                    type="datetime-local" 
                                    required 
                                    class="form-control"
                                />
                            </div>
                            <div class="form-group">
                                <label>End Date & Time *</label>
                                <input 
                                    v-model="meetingForm.endDate" 
                                    type="datetime-local" 
                                    required 
                                    class="form-control"
                                />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Location</label>
                            <input 
                                v-model="meetingForm.location" 
                                type="text" 
                                class="form-control"
                                placeholder="Meeting location (virtual/physical)"
                            />
                        </div>
                        <div class="form-group">
                            <label>Attendees</label>
                            <div class="checkbox-group">
                                <label 
                                    v-for="member in teamMembers" 
                                    :key="member.id" 
                                    class="checkbox-label"
                                >
                                    <input 
                                        type="checkbox" 
                                        :value="member.id" 
                                        v-model="meetingForm.attendees"
                                    />
                                    {{ member.name }}
                                </label>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="button" @click="closeMeetingModal" class="btn btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-success">
                                Schedule Meeting
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import {
    teamMembers,
    taskState,
    addTask,
    addMeeting,
    updateTaskStatus as updateTaskStatusInStore,
    deleteTask as deleteTaskFromStore,
    deleteMeeting as deleteMeetingFromStore,
    getPendingTasksCount,
    getUpcomingMeetings,
    generateCalendarEvents,
    formatDate,
    formatDateTime,
    getPriorityColor
} from '../components/WorkTracker.js'

export default {
    name: 'WorkTracker',
    components: {
        FullCalendar
    },
    setup() {
        const currentView = ref('dashboard')
        const showTaskModal = ref(false)
        const showMeetingModal = ref(false)
        
        const taskForm = reactive({
            title: '',
            description: '',
            memberId: '',
            dueDate: '',
            priority: 'medium'
        })
        
        const meetingForm = reactive({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            location: 'Virtual',
            attendees: []
        })

        // Forward declaration of functions to use in calendarOptions
        let handleEventClick;
        let handleDateClick;
        
        const calendarOptions = reactive({
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            initialView: 'dayGridMonth',
            events: [],
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            weekends: true,
            eventClick: info => handleEventClick && handleEventClick(info),
            dateClick: info => handleDateClick && handleDateClick(info),
            height: 'auto'
        })

        // Computed properties
        const recentTasks = computed(() => {
            return taskState.tasks
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
        })

        const upcomingMeetings = computed(() => {
            return getUpcomingMeetings().slice(0, 5)
        })

        // Methods
        const toggleView = () => {
            currentView.value = currentView.value === 'calendar' ? 'dashboard' : 'calendar'
            if (currentView.value === 'calendar') {
                updateCalendarEvents()
            }
        }

        const openTaskModalForMember = (memberId) => {
            taskForm.memberId = memberId
            showTaskModal.value = true
        }

        const closeTaskModal = () => {
            showTaskModal.value = false
            resetTaskForm()
        }

        const closeMeetingModal = () => {
            showMeetingModal.value = false
            resetMeetingForm()
        }

        const resetTaskForm = () => {
            taskForm.title = ''
            taskForm.description = ''
            taskForm.memberId = ''
            taskForm.dueDate = ''
            taskForm.priority = 'medium'
        }

        const resetMeetingForm = () => {
            meetingForm.title = ''
            meetingForm.description = ''
            meetingForm.startDate = ''
            meetingForm.endDate = ''
            meetingForm.location = 'Virtual'
            meetingForm.attendees = []
        }

        const submitTask = () => {
            if (!taskForm.title || !taskForm.memberId || !taskForm.dueDate) {
                alert('Please fill in all required fields')
                return
            }

            addTask(parseInt(taskForm.memberId), {
                title: taskForm.title,
                description: taskForm.description,
                dueDate: taskForm.dueDate,
                priority: taskForm.priority,
                assignedBy: 'Team Leader'
            })

            closeTaskModal()
            updateCalendarEvents()
        }

        const submitMeeting = () => {
            if (!meetingForm.title || !meetingForm.startDate || !meetingForm.endDate) {
                alert('Please fill in all required fields')
                return
            }

            if (new Date(meetingForm.startDate) >= new Date(meetingForm.endDate)) {
                alert('End date must be after start date')
                return
            }

            addMeeting({
                title: meetingForm.title,
                description: meetingForm.description,
                startDate: meetingForm.startDate,
                endDate: meetingForm.endDate,
                location: meetingForm.location,
                attendees: [...meetingForm.attendees]
            })

            closeMeetingModal()
            updateCalendarEvents()
        }

        const updateTaskStatus = (taskId, status) => {
            updateTaskStatusInStore(taskId, status)
            updateCalendarEvents()
        }

        const deleteTask = (taskId) => {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTaskFromStore(taskId)
                updateCalendarEvents()
            }
        }

        const deleteMeeting = (meetingId) => {
            if (confirm('Are you sure you want to delete this meeting?')) {
                deleteMeetingFromStore(meetingId)
                updateCalendarEvents()
            }
        }

        const getMemberName = (memberId) => {
            const member = teamMembers.find(m => m.id === memberId)
            return member ? member.name : 'Unknown'
        }

        const isOverdue = (dueDate) => {
            return new Date(dueDate) < new Date()
        }

        const updateCalendarEvents = () => {
            calendarOptions.events = generateCalendarEvents()
        }

        // Assign the implementation to the previously declared variable
        handleEventClick = (clickInfo) => {
            const event = clickInfo.event
            const props = event.extendedProps
            
            if (props.type === 'task') {
                const member = getMemberName(props.memberId)
                alert(`Task: ${event.title}\nAssigned to: ${member}\nPriority: ${props.priority}\nStatus: ${props.status}\nDescription: ${props.description || 'No description'}`)
            } else if (props.type === 'meeting') {
                const attendeeNames = props.attendees.map(id => getMemberName(id)).join(', ')
                alert(`Meeting: ${event.title}\nLocation: ${props.location}\nAttendees: ${attendeeNames}\nDescription: ${props.description || 'No description'}`)
            }
        }

        // Assign the implementation to the previously declared variable
        handleDateClick = (selectInfo) => {
            const clickedDate = selectInfo.dateStr
            taskForm.dueDate = clickedDate + 'T09:00'
            showTaskModal.value = true
        }

        // Initialize default dates
        const initializeForms = () => {
            const now = new Date()
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
            
            // Set default task due date to tomorrow 9 AM
            const defaultTaskDate = tomorrow.toISOString().slice(0, 16)
            taskForm.dueDate = defaultTaskDate

            // Set default meeting time to tomorrow 10 AM - 11 AM
            const meetingStart = new Date(tomorrow)
            meetingStart.setHours(10, 0, 0, 0)
            const meetingEnd = new Date(tomorrow)
            meetingEnd.setHours(11, 0, 0, 0)
            
            meetingForm.startDate = meetingStart.toISOString().slice(0, 16)
            meetingForm.endDate = meetingEnd.toISOString().slice(0, 16)
        }

        // Lifecycle
        onMounted(() => {
            initializeForms()
            updateCalendarEvents()
        })

        return {
            // Reactive data
            currentView,
            showTaskModal,
            showMeetingModal,
            taskForm,
            meetingForm,
            calendarOptions,
            teamMembers,
            taskState,
            
            // Computed
            recentTasks,
            upcomingMeetings,
            
            // Methods
            toggleView,
            openTaskModalForMember,
            closeTaskModal,
            closeMeetingModal,
            submitTask,
            submitMeeting,
            updateTaskStatus,
            deleteTask,
            deleteMeeting,
            getMemberName,
            isOverdue,
            getPendingTasksCount,
            formatDate,
            formatDateTime,
            getPriorityColor
        }
    }
}
</script>

<style scoped>
.work-tracker-container {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Section */
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    margin-top: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
}

.header-section h1 {
    margin-top: 1.5rem;
    color: #ffffff;
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
}

.action-buttons {
    display: flex;
    gap: 1rem;
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-success {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
}

.btn-secondary {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    color: #333;
}

.btn-danger {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    color: #333;
}

.btn-outline {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
}

/* Dashboard View */
.dashboard-view {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Team Overview */
.team-overview h2,
.recent-tasks h2,
.upcoming-meetings h2 {
    color: #ffffff;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    font-weight: 600;
}

.team-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.member-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.member-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.member-info h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.3rem;
}

.member-info .role {
    color: #666;
    margin: 0 0 0.75rem 0;
    font-style: italic;
}

.task-stats {
    font-size: 0.9rem;
    color: #888;
}

.pending-tasks {
    background: #575757;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    border: 1px solid #cce7ff;
}

/* Task List */
.task-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.task-item {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    transition: all 0.3s ease;
}

.task-item:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.task-item.overdue {
    border-left: 4px solid #ff4757;
    background: #fff5f5;
}

.task-content {
    flex: 1;
}

.task-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.task-title {
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;
}

.priority-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
}

.task-assignee,
.task-due {
    margin: 0.25rem 0;
    color: #666;
    font-size: 0.9rem;
}

.task-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.status-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: background-color 0.3s ease;
    font-weight: 600;
}

/* Meeting List */
.meeting-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.meeting-item {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #4CAF50;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.meeting-content h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.2rem;
}

.meeting-time,
.meeting-location {
    margin: 0.25rem 0;
    color: #666;
    font-size: 0.9rem;
}

.attendees {
    margin-top: 0.75rem;
    font-size: 0.9rem;
}

.attendee-tag {
    background: #e8f4fd;
    padding: 0.2rem 0.6rem;
    margin-right: 0.5rem;
    border-radius: 10px;
    font-size: 0.8rem;
    color: #0066cc;
}

/* Calendar View */
.calendar-view {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.6rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: #f0f0f0;
}

.modal-body {
    padding: 1.5rem;
}

/* Form Styles */
.form-group {
    margin-bottom: 1.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.form-control:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.checkbox-label:hover {
    background-color: #f8f9fa;
}

.checkbox-label input[type="checkbox"] {
    margin: 0;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

/* Icon styling */
.icon {
    font-size: 1.1em;
}

/* Responsive Design */
@media (max-width: 768px) {
    .work-tracker-container {
        padding: 1rem;
    }
    
    .header-section {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .action-buttons {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .team-cards {
        grid-template-columns: 1fr;
    }
    
    .member-card {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .task-item,
    .meeting-item {
        flex-direction: column;
        gap: 1rem;
    }
    
    .task-actions {
        justify-content: center;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .checkbox-group {
        grid-template-columns: 1fr;
    }
    
    .modal-actions {
        flex-direction: column;
    }
}

/* FullCalendar custom styling */
:deep(.fc-theme-standard .fc-scrollgrid) {
    border-radius: 8px;
    overflow: hidden;
}

:deep(.fc-event) {
    border-radius: 4px;
    border: none;
    padding: 2px 4px;
}

:deep(.fc-daygrid-event) {
    font-size: 0.85em;
}

:deep(.fc-button-primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

:deep(.fc-button-primary:not(:disabled):active),
:deep(.fc-button-primary:not(:disabled).fc-button-active) {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>