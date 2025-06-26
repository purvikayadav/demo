<template>
  <div>
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
        <v-icon start>mdi-numeric-8-box</v-icon>
        Class 8 Dashboard
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card color="#e3f2fd" class="text-center pa-4">
              <v-icon size="48" color="#1976d2">mdi-account-group</v-icon>
              <h3 class="text-h4 font-weight-bold mt-2">45</h3>
              <p class="text-body-1">Total Students</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="#f3e5f5" class="text-center pa-4">
              <v-icon size="48" color="#7b1fa2">mdi-book-open-variant</v-icon>
              <h3 class="text-h4 font-weight-bold mt-2">8</h3>
              <p class="text-body-1">Subjects</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="#e8f5e8" class="text-center pa-4">
              <v-icon size="48" color="#388e3c">mdi-clipboard-check</v-icon>
              <h3 class="text-h4 font-weight-bold mt-2">12</h3>
              <p class="text-body-1">Assignments</p>
            </v-card>
          </v-col>
        </v-row>
        
        <v-row class="mt-4">
          <v-col cols="12">
            <h4 class="text-h6 mb-3">Quick Actions</h4>
            <v-btn color="#6495ED" variant="flat" class="mr-3 mb-2" @click="addAssignment">
              <v-icon start>mdi-plus</v-icon>
              Add Assignment
            </v-btn>
            <v-btn color="#6495ED" variant="outlined" class="mr-3 mb-2" @click="viewReports">
              <v-icon start>mdi-chart-line</v-icon>
              View Reports
            </v-btn>
            <v-btn color="#6495ED" variant="outlined" class="mb-2" @click="manageStudents">
              <v-icon start>mdi-account-plus</v-icon>
              Manage Students
            </v-btn>
          </v-col>
        </v-row>

        <!-- Recent Activities -->
        <v-row class="mt-6">
          <v-col cols="12">
            <h4 class="text-h6 mb-3">Recent Activities</h4>
            <v-card variant="outlined">
              <v-list>
                <v-list-item
                  v-for="(activity, index) in recentActivities"
                  :key="index"
                  :prepend-icon="activity.icon"
                  :title="activity.title"
                  :subtitle="activity.subtitle"
                  class="py-2"
                >
                  <template v-slot:append>
                    <v-chip size="small" :color="activity.color" variant="tonal">
                      {{ activity.status }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Class8Component',
  props: {
    selectedClass: {
      type: String,
      default: ''
    },
    classInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      recentActivities: [
        {
          icon: 'mdi-clipboard-text',
          title: 'Math Assignment Submitted',
          subtitle: '32 out of 45 students completed',
          status: 'In Progress',
          color: 'orange'
        },
        {
          icon: 'mdi-book-open',
          title: 'Science Chapter 5 Started',
          subtitle: 'Introduction to Acids and Bases',
          status: 'Active',
          color: 'green'
        },
        {
          icon: 'mdi-calendar-check',
          title: 'Parent-Teacher Meeting',
          subtitle: 'Scheduled for next week',
          status: 'Scheduled',
          color: 'blue'
        },
        {
          icon: 'mdi-trophy',
          title: 'Sports Day Participation',
          subtitle: '40 students registered',
          status: 'Complete',
          color: 'green'
        }
      ]
    }
  },
  methods: {
    addAssignment() {
      console.log('Adding new assignment for Class 8')
      // Handle add assignment logic
    },
    viewReports() {
      console.log('Viewing reports for Class 8')
      // Handle view reports logic
    },
    manageStudents() {
      console.log('Managing students for Class 8')
      // Handle manage students logic
    }
  }
}
</script>

<style scoped>
/* Component specific styles */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
}
</style>