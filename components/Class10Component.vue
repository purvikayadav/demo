<template>
  <div>
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
        <v-icon start>mdi-numeric-10-box</v-icon>
        Class 10 Dashboard
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card color="#fff3e0" class="text-center pa-4">
              <v-icon size="48" color="#f57c00">mdi-account-group</v-icon>
              <h3 class="text-h4 font-weight-bold mt-2">38</h3>
              <p class="text-body-1">Total Students</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="#fce4ec" class="text-center pa-4">
              <v-icon size="48" color="#c2185b">mdi-book-open-variant</v-icon>
              <h3 class="text-h4 font-weight-bold mt-2">10</h3>
              <p class="text-body-1">Subjects</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="#e0f2f1" class="text-center pa-4">
              <v-icon size="48" color="#00695c">mdi-clipboard-check</v-icon>
              <h3 class="text-h4 font-weight-bold mt-2">15</h3>
              <p class="text-body-1">Assignments</p>
            </v-card>
          </v-col>
        </v-row>
        
        <v-row class="mt-4">
          <v-col cols="12">
            <h4 class="text-h6 mb-3">Board Exam Preparation</h4>
            <v-alert color="warning" variant="tonal" class="mb-3">
              <v-icon start>mdi-alert-circle</v-icon>
              Board exams are approaching. Monitor student progress closely.
            </v-alert>
            <v-btn color="#6495ED" variant="flat" class="mr-3 mb-2" @click="mockTests">
              <v-icon start>mdi-clipboard-text</v-icon>
              Mock Tests
            </v-btn>
            <v-btn color="#6495ED" variant="outlined" class="mr-3 mb-2" @click="progressTracking">
              <v-icon start>mdi-trending-up</v-icon>
              Progress Tracking
            </v-btn>
            <v-btn color="#6495ED" variant="outlined" class="mb-2" @click="studyMaterials">
              <v-icon start>mdi-book-multiple</v-icon>
              Study Materials
            </v-btn>
          </v-col>
        </v-row>

        <!-- Exam Schedule -->
        <v-row class="mt-6">
          <v-col cols="12" md="6">
            <h4 class="text-h6 mb-3">Upcoming Exams</h4>
            <v-card variant="outlined">
              <v-list>
                <v-list-item
                  v-for="(exam, index) in upcomingExams"
                  :key="index"
                  :prepend-icon="exam.icon"
                  :title="exam.subject"
                  :subtitle="exam.date"
                  class="py-2"
                >
                  <template v-slot:append>
                    <v-chip size="small" :color="exam.priority" variant="tonal">
                      {{ exam.type }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <h4 class="text-h6 mb-3">Performance Analytics</h4>
            <v-card variant="outlined" class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-icon color="green" class="mr-2">mdi-trending-up</v-icon>
                <span class="text-body-1">Average Score: <strong>78%</strong></span>
              </div>
              <div class="d-flex align-center mb-3">
                <v-icon color="blue" class="mr-2">mdi-account-check</v-icon>
                <span class="text-body-1">Attendance: <strong>92%</strong></span>
              </div>
              <div class="d-flex align-center">
                <v-icon color="orange" class="mr-2">mdi-clipboard-list</v-icon>
                <span class="text-body-1">Assignments: <strong>15/18</strong></span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Class10Component',
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
      upcomingExams: [
        {
          icon: 'mdi-calculator',
          subject: 'Mathematics',
          date: 'Dec 15, 2024',
          type: 'Mock Test',
          priority: 'red'
        },
        {
          icon: 'mdi-atom',
          subject: 'Science',
          date: 'Dec 18, 2024',
          type: 'Unit Test',
          priority: 'orange'
        },
        {
          icon: 'mdi-translate',
          subject: 'English',
          date: 'Dec 22, 2024',
          type: 'Assignment',
          priority: 'blue'
        },
        {
          icon: 'mdi-earth',
          subject: 'Social Studies',
          date: 'Dec 25, 2024',
          type: 'Project',
          priority: 'green'
        }
      ]
    }
  },
  methods: {
    mockTests() {
      console.log('Opening mock tests for Class 10')
      // Handle mock tests logic
    },
    progressTracking() {
      console.log('Opening progress tracking for Class 10')
      // Handle progress tracking logic
    },
    studyMaterials() {
      console.log('Opening study materials for Class 10')
      // Handle study materials logic
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

.v-alert {
  border-left: 4px solid #ff9800;
}
</style>