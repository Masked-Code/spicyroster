# Leave Management System

This document describes the leave management system implemented for the Spicy Roster muster tracking application.

## Overview

The leave management system allows users to schedule future leave and automatically displays leave status in the muster list when personnel are on approved leave.

## Features

### 1. Leave Scheduling
- Users can schedule leave for any sailor in the expected personnel list
- Leave requests require:
  - Sailor name (selected from dropdown)
  - Start date (must be in the future)
  - End date (must be after start date)
  - Leave type (Annual, Sick, Personal, Emergency, Training, TDY, Other)

### 2. Automatic Muster Status
- When a sailor is on scheduled leave, they automatically appear as "🏖️ On Leave" in the muster list
- Leave status shows the type of leave in the location field (e.g., "On Annual Leave")
- Time shows "All Day" for leave status
- Sailors on leave are highlighted in blue

### 3. Leave Tracking
- All scheduled leave is displayed in a dedicated table
- Leave entries show:
  - Sailor name with title
  - Leave type
  - Start and end dates
  - Duration (calculated in days)
  - Status (Active, Upcoming, or Past)

## How It Works

### Data Storage
- Leave data is stored using Nuxt's storage system
- Each leave request gets a unique ID: `{name}-{startDate}-{timestamp}`
- Individual leave records are stored as `leave:{leaveId}`
- A master list of leave IDs is maintained as `leave:list`

### Muster Integration
- When displaying the muster list, the system checks for active leave on the current date
- If a sailor has active leave, their status automatically shows as "On Leave"
- This overrides any manual muster entry

### API Endpoints

#### POST /api/leave
Creates a new leave request with validation:
- Validates all required fields are present
- Ensures end date is after start date
- Prevents scheduling leave in the past

#### GET /api/leave
Returns all scheduled leave requests, sorted by creation date

#### GET /api/leave/[date]
Returns all active leave for a specific date (YYYY-MM-DD format)

### Components

#### LeaveInput.vue
- Form for scheduling new leave
- Includes validation and success/error messaging
- Emits events to refresh related lists

#### LeaveList.vue
- Displays all scheduled leave in a sortable table
- Shows leave status with color coding:
  - Blue: Currently active leave
  - Green: Upcoming leave
  - Gray: Past leave

## Usage Instructions

### Scheduling Leave
1. Navigate to the "Schedule Leave" section
2. Select a sailor from the dropdown
3. Choose start and end dates
4. Select the type of leave
5. Click "Schedule Leave"

### Viewing Leave Status
1. Check the "Today's Muster List" to see who is currently on leave
2. Check the "Scheduled Leave" table to see all future and past leave

## Technical Implementation

### File Structure
```
server/api/
├── leave.post.ts          # Create leave requests
├── leave.get.ts           # Get all leave requests
└── leave/[date].ts        # Get leave for specific date

components/
├── LeaveInput.vue         # Leave scheduling form
└── LeaveList.vue          # Leave display table
```

### Integration Points
- `MusterList.vue` was modified to check for active leave
- `pages/index.vue` includes the new leave components
- Leave data is fetched alongside muster data for efficient display

## Future Enhancements

Potential improvements for the leave system:
- Leave approval workflow
- Leave balance tracking
- Email notifications
- Leave cancellation/modification
- Recurring leave patterns
- Leave reports and statistics
