viewAssignment(assignment) {
            console.log('View assignment:', assignment)
            this.viewAssignmentPreview(assignment)
        },

        viewAssignmentPreview(assignment) {
            console.log('📖 Opening assignment preview:', assignment.title)
            this.previewAssignment = assignment
            this.studentResponses = {} // Reset responses
            this.isPreviewMode = true
            this.showAssignmentPreviewDialog = true
            
            // Initialize empty responses for preview
            if (assignment.questions) {
                assignment.questions.forEach((question, index) => {
                    this.studentResponses[`q_${index}`] = ''
                })
            }
        },

        closeAssignmentPreview() {
            this.showAssignmentPreviewDialog = false
            this.previewAssignment = null
            this.studentResponses = {}
        },

        saveAsDraft() {
            console.log('💾 Saving assignment as draft...')
            console.log('Student responses:', this.studentResponses)
            this.showSuccess('Assignment saved as draft! (Preview mode)')
        },

        submitAssignment() {
            console.log('📤 Submitting assignment...')
            console.log('Student responses:', this.studentResponses)
            
            // Validate that at least some questions are answered
            const answeredQuestions = Object.values(this.studentResponses).filter(response => 
                response && response.toString().trim() !== ''
            ).length
            
            if (answeredQuestions === 0) {
                this.showError('Please answer at least one question before submitting.')
                return
            }
            
            // Simulate submission
            this.showSuccess(`Assignment submitted successfully! (Preview mode - ${answeredQuestions} questions answered)`)
            this.closeAssignmentPreview()
        },

        async viewSubmissions(assignment) {
            console.log('📋 Loading submissions for:', assignment.title)
            this.submissionAssignment = assignment
            this.showSubmissionsDialog = true
            this.submissionsLoading = true
            
            try {
                // Simulate API call to load submissions
                await this.loadSubmissions(assignment.id)
            } catch (error) {
                console.error('Error loading submissions:', error)
                this.showError('Failed to load submissions')
            } finally {
                this.submissionsLoading = false
            }
        },

        async loadSubmissions(assignmentId) {
            console.log('🔄 Loading submissions for assignment:', assignmentId)
            
            try {
                // Simulate API call - replace with actual API endpoint
                // const response = await $fetch(`/api/assignments/${assignmentId}/submissions`)
                
                // Mock submissions data for demonstration
                this.submissions = [
                    {
                        id: 1,
                        studentName: 'John Doe',
                        studentId: 101,
                        submittedAt: new Date().toISOString(),
                        status: 'submitted',
                        score: 85,
                        responses: {
                            'q_0': 0, // First option selected for MCQ
                            'q_1': 'true',
                            'q_2': 'This is a short answer response',
                            'q_3': 'This is a detailed long answer explaining the concept thoroughly.'
                        }
                    },
                    {
                        id: 2,
                        studentName: 'Jane Smith',
                        studentId: 102,
                        submittedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                        status: 'submitted',
                        score: 92,
                        responses: {
                            'q_0': 1,
                            'q_1': 'false',
                            'q_2': 'Another short answer',
                            'q_3': 'Comprehensive explanation with examples and proper formatting.'
                        }
                    },
                    {
                        id: 3,
                        studentName: 'Mike Johnson',
                        studentId: 103,
                        submittedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                        status: 'draft',
                        score: 0,
                        responses: {
                            'q_0': 2,
                            'q_1': 'true'
                        }
                    }
                ]
                
                console.log('✅ Submissions loaded:', this.submissions.length)
            } catch (error) {
                console.error('❌ Error loading submissions:', error)
                this.submissions = []
                throw error
            }
        },

        closeSubmissionsView() {
            this.showSubmissionsDialog = false
            this.submissionAssignment = null
            this.submissions = []
        },

        refreshSubmissions() {
            if (this.submissionAssignment) {
                this.loadSubmissions(this.submissionAssignment.id)
            }
        },

        calculateAverageScore() {
            if (!this.submissions.length) return 0
            
            const submittedOnes = this.submissions.filter(s => s.status === 'submitted' && s.score > 0)
            if (!submittedOnes.length) return 0
            
            const totalScore = submittedOnes.reduce((sum, submission) => sum + submission.score, 0)
            return Math.round(totalScore / submittedOnes.length)
        },

        getSubmissionStatusColor(status) {
            const colors = {
                'submitted': 'green',
                'draft': 'orange',
                'pending': 'grey',
                'graded': 'blue'
            }
            return colors[status] || 'grey'
        },

        formatStudentResponse(response, question) {
            if (!question) return response
            
            if (question.questionType === 'multiple-choice' && question.options) {
                const optionIndex = parseInt(response)
                return question.options[optionIndex]?.text || `Option ${optionIndex + 1}`
            }
            
            if (question.questionType === 'true-false') {
                return response === 'true' ? 'True' : 'False'
            }
            
            return response
        },

        gradeSubmission(submission) {
            console.log('🌟 Grading submission:', submission)
            this.showError('Grading functionality coming soon!')
            // TODO: Implement grading dialog
        },

        provideFeedback(submission) {
            console.log('💬 Providing feedback for:', submission)
            this.showError('Feedback functionality coming soon!')
            // TODO: Implement feedback dialog
        },

        downloadSubmission(submission) {
            console.log('📥 Downloading submission:', submission)
            this.showError('Download functionality coming soon!')
            // TODO: Implement submission download
        },<template>
  <v-app>
    <!-- Navigation Drawer (Left Sidebar) -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.lgAndUp"
      :temporary="$vuetify.display.mdAndDown"
      app
      color="#f5f5f5"
      width="280"
      class="custom-drawer"
    >
      <!-- Drawer Header -->
      <v-list-item class="drawer-header">
        <template v-slot:prepend>
          <v-avatar color="#6495ED" size="40">
            <v-icon color="white">mdi-school</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">
          Teacher Portal
        </v-list-item-title>
        <v-list-item-subtitle>
          Welcome {{ currentUser?.name || 'Teacher' }}
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Class Sections -->
      <v-list nav class="py-0">
        <v-list-subheader class="text-uppercase font-weight-bold text-grey-darken-1 d-flex justify-space-between align-center">
          <span>Classes</span>
          <v-btn
            icon="mdi-plus"
            size="small"
            color="#6495ED"
            variant="text"
            @click="showAddClassDialog = true"
          ></v-btn>
        </v-list-subheader>

        <!-- Show message if no classes -->
        <div v-if="classes.length === 0" class="pa-4 text-center">
          <v-icon color="grey" class="mb-2">mdi-school-outline</v-icon>
          <p class="text-body-2 text-grey">No classes added yet</p>
          <v-btn
            color="#6495ED"
            variant="outlined"
            size="small"
            @click="showAddClassDialog = true"
          >
            Add First Class
          </v-btn>
        </div>

        <!-- Dynamic Classes List -->
        <v-list-item
          v-for="classItem in classes"
          :key="classItem.id"
          :value="classItem.id"
          :active="selectedClass === classItem.id"
          @click="selectClass(classItem.id)"
          class="mb-1 mx-2 rounded-lg class-item"
          :class="{ 'selected-class': selectedClass === classItem.id }"
        >
          <template v-slot:prepend>
            <v-icon :color="selectedClass === classItem.id ? '#6495ED' : 'grey'">
              {{ classItem.icon }}
            </v-icon>
          </template>
          <v-list-item-title class="font-weight-medium">
            {{ classItem.name }}
          </v-list-item-title>
          <template v-slot:append>
            <div class="d-flex align-center">
              <v-chip
                size="small"
                :color="selectedClass === classItem.id ? '#6495ED' : 'grey-lighten-2'"
                variant="flat"
                class="mr-2"
              >
                {{ classItem.studentCount }}
              </v-chip>
              <v-btn
                icon="mdi-delete"
                size="x-small"
                color="red"
                variant="text"
                @click.stop="confirmDeleteClass(classItem)"
                class="delete-btn"
              ></v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <!-- Additional Menu Items -->
      <v-list nav class="py-0">
        <v-list-subheader class="text-uppercase font-weight-bold text-grey-darken-1">
          Menu
        </v-list-subheader>

        <v-list-item
          v-for="menuItem in menuItems"
          :key="menuItem.id"
          @click="handleMenuClick(menuItem.action)"
          class="mb-1 mx-2 rounded-lg menu-item"
        >
          <template v-slot:prepend>
            <v-icon color="grey">{{ menuItem.icon }}</v-icon>
          </template>
          <v-list-item-title class="font-weight-medium">
            {{ menuItem.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Logout Button at Bottom -->
      <template v-slot:append>
        <div class="pa-4">
          <v-btn
            @click="logout"
            color="#6495ED"
            variant="outlined"
            block
            class="text-capitalize"
          >
            <v-icon start>mdi-logout</v-icon>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar (Top Header) -->
    <v-app-bar
      app
      color="#6495ED"
      dark
      elevation="2"
      height="64"
      class="custom-app-bar"
    >
      <!-- Menu Button for Mobile -->
      <v-app-bar-nav-icon
        v-if="$vuetify.display.mdAndDown"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <!-- Title -->
      <v-app-bar-title class="font-weight-bold">
        {{ selectedClassInfo?.name || 'Teacher Dashboard' }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- User Info -->
      <div class="d-flex align-center">
        <div class="text-right mr-3 d-none d-sm-block">
          <div class="text-body-2">{{ currentUser?.name || 'Teacher' }}</div>
          <div class="text-caption opacity-75">{{ currentUser?.contactNo || 'Contact not available' }}</div>
        </div>
        <v-avatar size="40" color="white">
          <v-icon color="#6495ED">mdi-account</v-icon>
        </v-avatar>
      </div>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="custom-main">
      <v-container fluid class="pa-6">
        <!-- Dynamic Content Based on Selected Class -->
        
        <!-- Default Dashboard - Show only when no classes or default selected -->
        <div v-if="selectedClass === 'default'">
          <v-card class="mb-6" elevation="2">
            <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
              <v-icon start>mdi-view-dashboard</v-icon>
              Teacher Dashboard
            </v-card-title>
            <v-card-text>
              <v-alert color="info" variant="tonal" class="mb-4">
                <v-icon start>mdi-information</v-icon>
                Select a class from the sidebar to view specific class information.
              </v-alert>
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-card 
                    color="#e3f2fd" 
                    class="pa-4 clickable-card" 
                    @click="showClassesList = true"
                    elevation="2"
                  >
                    <h4 class="text-h6 mb-2">Total Classes</h4>
                    <h2 class="text-h3 font-weight-bold" style="color: #1976d2;">{{ classes.length }}</h2>
                    <p class="text-body-2">Classes created</p>
                    <v-icon class="card-arrow" color="#1976d2">mdi-chevron-right</v-icon>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card 
                    color="#f3e5f5" 
                    class="pa-4 clickable-card" 
                    @click="showStudentsList = true"
                    elevation="2"
                  >
                    <h4 class="text-h6 mb-2">Total Students</h4>
                    <h2 class="text-h3 font-weight-bold" style="color: #7b1fa2;">{{ totalStudents }}</h2>
                    <p class="text-body-2">Across all classes</p>
                    <v-icon class="card-arrow" color="#7b1fa2">mdi-chevron-right</v-icon>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Dynamic Class Content -->
        <div v-else-if="selectedClassInfo">
          <!-- Back to Dashboard Button -->
          <div class="mb-4">
            <v-btn
              color="#6495ED"
              variant="outlined"
              @click="backToDashboard"
              class="text-capitalize"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              Back to Dashboard
            </v-btn>
          </div>

          <v-card class="mb-6" elevation="2">
            <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
              <v-icon start>{{ selectedClassInfo.icon }}</v-icon>
              {{ selectedClassInfo.name }} Dashboard
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-card color="#e3f2fd" class="text-center pa-4">
                    <v-icon size="48" color="#1976d2">mdi-account-group</v-icon>
                    <h3 class="text-h4 font-weight-bold mt-2">{{ selectedClassInfo.studentCount }}</h3>
                    <p class="text-body-1">Total Students</p>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card color="#f3e5f5" class="text-center pa-4">
                    <v-icon size="48" color="#7b1fa2">mdi-book-open-variant</v-icon>
                    <h3 class="text-h4 font-weight-bold mt-2">0</h3>
                    <p class="text-body-1">Subjects</p>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card 
                    color="#e8f5e8" 
                    class="text-center pa-4 clickable-card assignment-count-card"
                    @click="showAssignmentsList = true"
                  >
                    <v-icon size="48" color="#388e3c">mdi-clipboard-check</v-icon>
                    <h3 class="text-h4 font-weight-bold mt-2">{{ assignments.length }}</h3>
                    <p class="text-body-1">Assignments</p>
                    <v-icon class="card-arrow" color="#388e3c">mdi-chevron-right</v-icon>
                  </v-card>
                </v-col>
              </v-row>
              
              <v-row class="mt-4">
                <v-col cols="12">
                  <h4 class="text-h6 mb-3">Quick Actions for {{ selectedClassInfo.name }}</h4>
                  <v-btn color="#6495ED" variant="flat" class="mr-3 mb-2" @click="openAssignmentForm">
                    <v-icon start>mdi-plus</v-icon>
                    Add Assignment
                  </v-btn>
                  <v-btn color="#6495ED" variant="outlined" class="mr-3 mb-2">
                    <v-icon start>mdi-chart-line</v-icon>
                    View Reports
                  </v-btn>
                  <v-btn color="#6495ED" variant="outlined" class="mr-3 mb-2">
                    <v-icon start>mdi-account-plus</v-icon>
                    Manage Students
                  </v-btn>
                  <v-btn color="#6495ED" variant="outlined" class="mb-2">
                    <v-icon start>mdi-book-multiple</v-icon>
                    Class Materials
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Class-specific content based on class name -->
              <v-row class="mt-6" v-if="selectedClassInfo.name.toLowerCase().includes('10')">
                <v-col cols="12">
                  <v-alert color="warning" variant="tonal" class="mb-3">
                    <v-icon start>mdi-alert-circle</v-icon>
                    Board exam preparation is crucial for {{ selectedClassInfo.name }} students.
                  </v-alert>
                </v-col>
              </v-row>

              <v-row class="mt-6" v-if="selectedClassInfo.name.toLowerCase().includes('12')">
                <v-col cols="12">
                  <v-alert color="info" variant="tonal" class="mb-3">
                    <v-icon start>mdi-school</v-icon>
                    {{ selectedClassInfo.name }} - Focus on career guidance and college preparation.
                  </v-alert>
                </v-col>
              </v-row>

              <!-- Assignments Section -->
              <v-row class="mt-6">
                <v-col cols="12">
                  <div class="d-flex justify-space-between align-center mb-4">
                    <h4 class="text-h6">Recent Assignments</h4>
                    <v-btn
                      color="#6495ED"
                      variant="outlined"
                      size="small"
                      @click="loadAssignments"
                      :loading="assignmentsLoading"
                    >
                      <v-icon start>mdi-refresh</v-icon>
                      Refresh
                    </v-btn>
                  </div>

                  <!-- Show only first 3 assignments -->
                  <v-row v-if="assignments.length > 0">
                    <v-col
                      v-for="assignment in assignments.slice(0, 3)"
                      :key="assignment.id"
                      cols="12"
                      md="6"
                      lg="4"
                    >
                      <v-card class="assignment-card" elevation="3" hover>
                        <v-card-title class="pa-4 pb-2">
                          <div class="d-flex justify-space-between align-start">
                            <div class="assignment-header">
                              <h5 class="text-h6 font-weight-bold text-truncate" style="color: #6495ED;">
                                {{ assignment.title }}
                              </h5>
                              <p class="text-caption text-grey mb-0">
                                {{ assignment.subject }} • {{ assignment.chapter }}
                              </p>
                            </div>
                            <v-menu>
                              <template v-slot:activator="{ props }">
                                <v-btn
                                  icon="mdi-dots-vertical"
                                  size="small"
                                  variant="text"
                                  v-bind="props"
                                ></v-btn>
                              </template>
                              <v-list>
                                <v-list-item @click="viewAssignment(assignment)">
                                  <v-list-item-title>
                                    <v-icon start>mdi-eye</v-icon>
                                    View Details
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="editAssignment(assignment)">
                                  <v-list-item-title>
                                    <v-icon start>mdi-pencil</v-icon>
                                    Edit
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="deleteAssignment(assignment)">
                                  <v-list-item-title>
                                    <v-icon start color="red">mdi-delete</v-icon>
                                    Delete
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </v-card-title>

                        <v-card-text class="pa-4 pt-0">
                          <div v-if="assignment.description" class="mb-3">
                            <p class="text-body-2 text-grey-darken-1">
                              {{ assignment.description.length > 100 ? 
                                assignment.description.substring(0, 100) + '...' : 
                                assignment.description }}
                            </p>
                          </div>

                          <div class="assignment-stats">
                            <v-row class="text-center">
                              <v-col cols="4">
                                <div class="stat-item">
                                  <v-icon color="#6495ED" class="mb-1">mdi-help-circle</v-icon>
                                  <p class="text-caption text-grey mb-0">Questions</p>
                                  <p class="text-h6 font-weight-bold mb-0" style="color: #6495ED;">
                                    {{ assignment.questions?.length || 0 }}
                                  </p>
                                </div>
                              </v-col>
                              <v-col cols="4">
                                <div class="stat-item">
                                  <v-icon color="orange" class="mb-1">mdi-star</v-icon>
                                  <p class="text-caption text-grey mb-0">Max Marks</p>
                                  <p class="text-h6 font-weight-bold mb-0" style="color: orange;">
                                    {{ assignment.calculatedMarks || assignment.maxMarks || 0 }}
                                  </p>
                                </div>
                              </v-col>
                              <v-col cols="4">
                                <div class="stat-item">
                                  <v-icon color="green" class="mb-1">mdi-account-check</v-icon>
                                  <p class="text-caption text-grey mb-0">Submissions</p>
                                  <p class="text-h6 font-weight-bold mb-0" style="color: green;">
                                    {{ assignment.submissions?.length || 0 }}
                                  </p>
                                </div>
                              </v-col>
                            </v-row>
                          </div>

                          <!-- Due Date -->
                          <div v-if="assignment.dueDate" class="mt-3">
                            <v-chip
                              :color="isOverdue(assignment.dueDate) ? 'red' : isPastDue(assignment.dueDate) ? 'orange' : 'green'"
                              size="small"
                              variant="tonal"
                              class="mr-2"
                            >
                              <v-icon start>mdi-calendar</v-icon>
                              Due: {{ formatDate(assignment.dueDate) }}
                            </v-chip>
                          </div>

                          <!-- Status -->
                          <div class="mt-3">
                            <v-chip
                              :color="getAssignmentStatusColor(assignment.status)"
                              size="small"
                              variant="flat"
                            >
                              {{ assignment.status || 'Active' }}
                            </v-chip>
                          </div>
                        </v-card-text>

                        <v-card-actions class="pa-4 pt-0">
                          <v-btn
                            color="#6495ED"
                            variant="outlined"
                            size="small"
                            @click="viewAssignmentPreview(assignment)"
                          >
                            <v-icon start>mdi-eye</v-icon>
                            Preview
                          </v-btn>
                          <v-btn
                            color="green"
                            variant="outlined"
                            size="small"
                            @click="viewSubmissions(assignment)"
                            class="ml-2"
                          >
                            <v-icon start>mdi-clipboard-list</v-icon>
                            Submissions ({{ assignment.submissions?.length || 0 }})
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="#6495ED"
                            variant="flat"
                            size="small"
                            @click="openShareDialog(assignment)"
                          >
                            <v-icon start>mdi-share</v-icon>
                            Share
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Show more button if there are more than 3 assignments -->
                  <div v-if="assignments.length > 3" class="text-center mt-4">
                    <v-btn
                      color="#6495ED"
                      variant="outlined"
                      @click="showAssignmentsList = true"
                    >
                      View All {{ assignments.length }} Assignments
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>

                  <!-- No Assignments State -->
                  <v-card v-else-if="!assignmentsLoading" variant="outlined" class="text-center pa-8">
                    <v-icon size="64" color="grey-lighten-2">mdi-clipboard-outline</v-icon>
                    <h4 class="text-h6 mt-3 text-grey">No assignments created yet</h4>
                    <p class="text-body-2 text-grey mb-4">
                      Create your first assignment to get started with {{ selectedClassInfo.name }}
                    </p>
                    <v-btn color="#6495ED" variant="flat" @click="openAssignmentForm">
                      <v-icon start>mdi-plus</v-icon>
                      Create First Assignment
                    </v-btn>
                  </v-card>

                  <!-- Loading State -->
                  <div v-else class="text-center pa-8">
                    <v-progress-circular indeterminate color="#6495ED"></v-progress-circular>
                    <p class="text-body-2 text-grey mt-3">Loading assignments...</p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

      </v-container>
    </v-main>

    <!-- Add Class Dialog -->
    <v-dialog v-model="showAddClassDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
          <v-icon start>mdi-plus-circle</v-icon>
          Add New Class
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="addClassForm" v-model="addClassValid" lazy-validation>
            <!-- Class Name Field -->
            <v-text-field
              v-model="newClass.name"
              :rules="classNameRules"
              label="Class Name"
              placeholder="e.g., Class 8, Class 10A, Grade 12"
              prepend-inner-icon="mdi-school"
              variant="outlined"
              class="mb-4"
              required
              clearable
            ></v-text-field>

            <!-- Student Count Field -->
            <v-text-field
              v-model="newClass.studentCount"
              :rules="studentCountRules"
              label="Number of Students"
              placeholder="e.g., 45"
              prepend-inner-icon="mdi-account-group"
              variant="outlined"
              type="number"
              min="1"
              max="100"
              required
              clearable
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="cancelAddClass"
            :disabled="addClassLoading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="#6495ED"
            variant="flat"
            @click="addNewClass"
            :loading="addClassLoading"
            :disabled="!addClassValid"
          >
            Add Class
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Assignment Multi-Step Dialog -->
    <v-dialog v-model="showAssignmentDialog" max-width="800px" persistent>
      <v-card>
        <!-- Step 1: Subject and Chapter -->
        <div v-if="assignmentStep === 1">
          <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
            <v-icon start>mdi-book-open-page-variant</v-icon>
            {{ isEditMode ? 'Edit Assignment - Step 1' : 'Create Assignment - Step 1' }}
          </v-card-title>
          
          <v-card-text class="pa-6">
            <v-stepper v-model="assignmentStep" alt-labels class="mb-4">
              <v-stepper-item :complete="assignmentStep > 1" :value="1" title="Subject & Chapter"></v-stepper-item>
              <v-stepper-item :value="2" title="Assignment Details"></v-stepper-item>
            </v-stepper>
            
            <v-form ref="assignmentBasicForm" v-model="assignmentBasicValid" lazy-validation>
              <v-text-field
                v-model="assignmentData.subject"
                :rules="subjectRules"
                label="Subject"
                placeholder="e.g., Mathematics, Science, English"
                prepend-inner-icon="mdi-book"
                variant="outlined"
                class="mb-4"
                required
                clearable
              ></v-text-field>

              <v-text-field
                v-model="assignmentData.chapter"
                :rules="chapterRules"
                label="Chapter"
                placeholder="e.g., Algebra, Photosynthesis, Grammar"
                prepend-inner-icon="mdi-bookmark"
                variant="outlined"
                class="mb-4"
                required
                clearable
              ></v-text-field>

              <v-text-field
                v-model="assignmentData.title"
                :rules="titleRules"
                label="Assignment Title"
                placeholder="e.g., Chapter 5 Practice Questions"
                prepend-inner-icon="mdi-file-document-outline"
                variant="outlined"
                class="mb-4"
                required
                clearable
              ></v-text-field>

              <v-textarea
                v-model="assignmentData.description"
                label="Description (Optional)"
                placeholder="Brief description of the assignment..."
                prepend-inner-icon="mdi-text"
                variant="outlined"
                rows="3"
                clearable
              ></v-textarea>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" @click="cancelAssignment">Cancel</v-btn>
            <v-btn color="#6495ED" variant="flat" @click="nextStep" :disabled="!assignmentBasicValid">
              Next: Add Questions
            </v-btn>
          </v-card-actions>
        </div>

        <!-- Step 2: Google Forms-like Question Builder -->
        <div v-if="assignmentStep === 2">
          <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
            <v-icon start>mdi-help-circle-outline</v-icon>
            {{ isEditMode ? 'Edit Assignment - Step 2' : 'Create Assignment - Step 2' }}
          </v-card-title>
          
          <v-card-text class="pa-6">
            <v-stepper v-model="assignmentStep" alt-labels class="mb-4">
              <v-stepper-item :complete="true" :value="1" title="Subject & Chapter"></v-stepper-item>
              <v-stepper-item :value="2" title="Assignment Details"></v-stepper-item>
            </v-stepper>

            <!-- Assignment Settings -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="assignmentData.dueDate"
                  label="Due Date"
                  type="date"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="assignmentData.maxMarks"
                  label="Maximum Marks"
                  type="number"
                  prepend-inner-icon="mdi-star"
                  variant="outlined"
                  placeholder="Auto-calculated from questions"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Questions Section -->
            <div class="questions-container">
              <h4 class="text-h6 mb-3">Questions</h4>
              
              <div v-for="(question, index) in assignmentData.questions" :key="index" class="question-card mb-4">
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-subtitle-1 font-weight-bold">Question {{ index + 1 }}</span>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="red"
                      variant="text"
                      @click="removeQuestion(index)"
                      v-if="assignmentData.questions.length > 1"
                    ></v-btn>
                  </div>

                  <v-textarea
                    v-model="question.questionText"
                    label="Question"
                    placeholder="Enter your question here..."
                    variant="outlined"
                    rows="2"
                    class="mb-3"
                    required
                  ></v-textarea>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="question.questionType"
                        :items="questionTypes"
                        label="Question Type"
                        variant="outlined"
                        @update:model-value="updateQuestionType(index)"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="question.marks"
                        label="Marks"
                        type="number"
                        variant="outlined"
                        min="1"
                        max="100"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <!-- Multiple Choice Options -->
                  <div v-if="question.questionType === 'multiple-choice'" class="mt-3">
                    <h5 class="text-subtitle-2 mb-2">Options</h5>
                    <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="d-flex align-center mb-2">
                      <v-text-field
                        v-model="option.text"
                        :label="`Option ${optionIndex + 1}`"
                        variant="outlined"
                        density="compact"
                        class="mr-2"
                      ></v-text-field>
                      <v-checkbox
                        v-model="option.isCorrect"
                        label="Correct"
                        @change="setCorrectAnswer(index, optionIndex)"
                      ></v-checkbox>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        color="red"
                        variant="text"
                        @click="removeOption(index, optionIndex)"
                        v-if="question.options.length > 2"
                      ></v-btn>
                    </div>
                    <v-btn
                      variant="outlined"
                      size="small"
                      @click="addOption(index)"
                      v-if="question.options.length < 5"
                    >
                      Add Option
                    </v-btn>
                  </div>

                  <!-- True/False -->
                  <div v-if="question.questionType === 'true-false'" class="mt-3">
                    <v-radio-group v-model="question.correctAnswer" label="Correct Answer" inline>
                      <v-radio label="True" value="true"></v-radio>
                      <v-radio label="False" value="false"></v-radio>
                    </v-radio-group>
                  </div>
                </v-card>
              </div>

              <!-- Add Question Button -->
              <v-btn
                color="#6495ED"
                variant="outlined"
                @click="addQuestion"
                class="mb-4"
              >
                <v-icon start>mdi-plus</v-icon>
                Add Question
              </v-btn>
            </div>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-btn variant="outlined" @click="previousStep">
              <v-icon start>mdi-arrow-left</v-icon>
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" @click="cancelAssignment">Cancel</v-btn>
            <v-btn
              color="#6495ED"
              variant="flat"
              @click="handleAssignmentSubmit"
              :loading="assignmentLoading"
              :disabled="!canCreateAssignment"
            >
              <v-icon start>{{ isEditMode ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
              {{ isEditMode ? 'Update Assignment' : 'Create Assignment' }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>

    <!-- Assignments List Dialog -->
    <v-dialog v-model="showAssignmentsList" max-width="1000px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
          <v-icon start>mdi-clipboard-check</v-icon>
          All Assignments for {{ selectedClassInfo?.name }} ({{ assignments.length }})
        </v-card-title>
        
        <v-card-text class="pa-0">
          <div v-if="assignments.length > 0" style="max-height: 600px; overflow-y: auto;">
            <v-row class="pa-4">
              <v-col
                v-for="assignment in assignments"
                :key="assignment.id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card class="assignment-card mb-4" elevation="3" hover>
                  <v-card-title class="pa-4 pb-2">
                    <div class="d-flex justify-space-between align-start">
                      <div class="assignment-header">
                        <h5 class="text-h6 font-weight-bold text-truncate" style="color: #6495ED;">
                          {{ assignment.title }}
                        </h5>
                        <p class="text-caption text-grey mb-0">
                          {{ assignment.subject }} • {{ assignment.chapter }}
                        </p>
                      </div>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon="mdi-dots-vertical"
                            size="small"
                            variant="text"
                            v-bind="props"
                          ></v-btn>
                        </template>
                        <v-list>
                          <v-list-item @click="viewAssignment(assignment)">
                            <v-list-item-title>
                              <v-icon start>mdi-eye</v-icon>
                              View Details
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="editAssignment(assignment)">
                            <v-list-item-title>
                              <v-icon start>mdi-pencil</v-icon>
                              Edit
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="openShareDialog(assignment)">
                            <v-list-item-title>
                              <v-icon start>mdi-share</v-icon>
                              Share
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="deleteAssignment(assignment)">
                            <v-list-item-title>
                              <v-icon start color="red">mdi-delete</v-icon>
                              Delete
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </v-card-title>

                  <v-card-text class="pa-4 pt-0">
                    <div v-if="assignment.description" class="mb-3">
                      <p class="text-body-2 text-grey-darken-1">
                        {{ assignment.description.length > 80 ? 
                          assignment.description.substring(0, 80) + '...' : 
                          assignment.description }}
                      </p>
                    </div>

                    <div class="assignment-stats">
                      <v-row class="text-center">
                        <v-col cols="4">
                          <div class="stat-item">
                            <v-icon color="#6495ED" class="mb-1">mdi-help-circle</v-icon>
                            <p class="text-caption text-grey mb-0">Questions</p>
                            <p class="text-h6 font-weight-bold mb-0" style="color: #6495ED;">
                              {{ assignment.questions?.length || 0 }}
                            </p>
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="stat-item">
                            <v-icon color="orange" class="mb-1">mdi-star</v-icon>
                            <p class="text-caption text-grey mb-0">Max Marks</p>
                            <p class="text-h6 font-weight-bold mb-0" style="color: orange;">
                              {{ assignment.calculatedMarks || assignment.maxMarks || 0 }}
                            </p>
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="stat-item">
                            <v-icon color="green" class="mb-1">mdi-account-check</v-icon>
                            <p class="text-caption text-grey mb-0">Submissions</p>
                            <p class="text-h6 font-weight-bold mb-0" style="color: green;">
                              {{ assignment.submissions?.length || 0 }}
                            </p>
                          </div>
                        </v-col>
                      </v-row>
                    </div>

                    <!-- Due Date -->
                    <div v-if="assignment.dueDate" class="mt-3">
                      <v-chip
                        :color="isOverdue(assignment.dueDate) ? 'red' : isPastDue(assignment.dueDate) ? 'orange' : 'green'"
                        size="small"
                        variant="tonal"
                        class="mr-2"
                      >
                        <v-icon start>mdi-calendar</v-icon>
                        Due: {{ formatDate(assignment.dueDate) }}
                      </v-chip>
                    </div>

                    <!-- Status -->
                    <div class="mt-3">
                      <v-chip
                        :color="getAssignmentStatusColor(assignment.status)"
                        size="small"
                        variant="flat"
                      >
                        {{ assignment.status || 'Active' }}
                      </v-chip>
                    </div>
                  </v-card-text>

                  <v-card-actions class="pa-4 pt-0">
                    <v-btn
                      color="#6495ED"
                      variant="outlined"
                      size="small"
                      @click="viewAssignmentPreview(assignment)"
                    >
                      <v-icon start>mdi-eye</v-icon>
                      Preview
                    </v-btn>
                    <v-btn
                      color="green"
                      variant="outlined"
                      size="small"
                      @click="viewSubmissions(assignment)"
                      class="ml-2"
                    >
                      <v-icon start>mdi-clipboard-list</v-icon>
                      Submissions
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="#6495ED"
                      variant="flat"
                      size="small"
                      @click="openShareDialog(assignment)"
                    >
                      <v-icon start>mdi-share</v-icon>
                      Share
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
          
          <div v-else class="pa-6 text-center">
            <v-icon size="64" color="grey-lighten-2">mdi-clipboard-outline</v-icon>
            <p class="text-h6 mt-3 text-grey">No assignments created yet</p>
            <v-btn color="#6495ED" variant="outlined" @click="openAssignmentForm; showAssignmentsList = false">
              Create First Assignment
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showAssignmentsList = false">Close</v-btn>
          <v-btn color="#6495ED" variant="flat" @click="openAssignmentForm; showAssignmentsList = false">
            Create New Assignment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assignment Preview Dialog (Student View) -->
    <!-- Fixed Text Color Assignment Preview Dialog -->
<v-dialog v-model="showAssignmentPreviewDialog" max-width="1000px" persistent>
  <v-card class="preview-dialog-card" elevation="24">
    <!-- Enhanced Header with Fixed Text Colors -->
    <v-card-title class="preview-header pa-0">
      <div class="preview-header-content pa-6">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" class="preview-icon mr-4" color="white" variant="elevated">
              <v-icon size="28" color="#6495ED">mdi-school</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h5 font-weight-bold header-title mb-1">
                {{ previewAssignment?.title }}
              </h2>
              <p class="text-body-2 header-subtitle mb-0">
                Assignment Preview • {{ previewAssignment?.subject }}
              </p>
            </div>
          </div>
          <v-chip color="rgba(255,255,255,0.9)" variant="elevated" size="large" class="preview-badge">
            <v-icon start color="#6495ED">mdi-eye</v-icon>
            <span class="badge-text font-weight-bold">Student View</span>
          </v-chip>
        </div>
      </div>
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text class="pa-0" style="max-height: 75vh; overflow-y: auto;">
      <div v-if="previewAssignment" class="preview-content">
        
        <!-- Enhanced Assignment Header Card -->
        <div class="assignment-hero pa-6">
          <v-card class="assignment-info-card" elevation="8" rounded="xl">
            <div class="assignment-info-header">
              <v-card-text class="pa-6">
                <v-row align="center">
                  <v-col cols="12" md="8">
                    <div class="assignment-details">
                      <div class="d-flex align-center mb-3">
                        <v-icon size="24" color="#6495ED" class="mr-3">mdi-book-open-variant</v-icon>
                        <h3 class="text-h6 font-weight-bold assignment-subject-text">
                          {{ previewAssignment.subject }}
                        </h3>
                      </div>
                      
                      <div class="d-flex align-center mb-3">
                        <v-icon size="24" color="#6495ED" class="mr-3">mdi-bookmark-outline</v-icon>
                        <h4 class="text-subtitle-1 font-weight-medium assignment-chapter-text">
                          Chapter: {{ previewAssignment.chapter }}
                        </h4>
                      </div>

                      <div v-if="previewAssignment.description" class="assignment-description mt-4">
                        <div class="d-flex align-center mb-2">
                          <v-icon size="20" color="#6495ED" class="mr-2">mdi-information-outline</v-icon>
                          <span class="text-subtitle-2 font-weight-bold instruction-text">Instructions</span>
                        </div>
                        <v-card color="#f8fffe" variant="outlined" class="pa-4 description-card" rounded="lg">
                          <p class="text-body-1 mb-0 description-text-black">{{ previewAssignment.description }}</p>
                        </v-card>
                      </div>
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="4">
                    <div class="assignment-stats">
                      <v-card color="linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)" variant="flat" class="stat-card mb-3" rounded="xl">
                        <v-card-text class="pa-4 text-center">
                          <v-icon size="32" color="#2e7d32" class="mb-2">mdi-star-circle</v-icon>
                          <h2 class="text-h4 font-weight-bold stat-number-green">
                            {{ getPreviewAssignmentMarks() }}
                          </h2>
                          <p class="text-body-2 font-weight-medium mb-0 stat-label-green">Total Marks</p>
                        </v-card-text>
                      </v-card>

                      <v-card v-if="previewAssignment.dueDate" color="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)" variant="flat" class="stat-card mb-3" rounded="xl">
                        <v-card-text class="pa-4 text-center">
                          <v-icon size="32" color="#f57c00" class="mb-2">mdi-calendar-clock</v-icon>
                          <p class="text-h6 font-weight-bold mb-1 stat-number-orange">
                            {{ formatDate(previewAssignment.dueDate) }}
                          </p>
                          <p class="text-body-2 font-weight-medium mb-0 stat-label-orange">Due Date</p>
                        </v-card-text>
                      </v-card>

                      <v-card color="linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)" variant="flat" class="stat-card" rounded="xl">
                        <v-card-text class="pa-4 text-center">
                          <v-icon size="32" color="#7b1fa2" class="mb-2">mdi-help-circle</v-icon>
                          <h3 class="text-h5 font-weight-bold mb-1 stat-number-purple">
                            {{ previewAssignment.questions?.length || 0 }}
                          </h3>
                          <p class="text-body-2 font-weight-medium mb-0 stat-label-purple">
                            Question{{ (previewAssignment.questions?.length || 0) !== 1 ? 's' : '' }}
                          </p>
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-col>
                </v-row>

                <!-- Enhanced Progress Indicator -->
                <div v-if="isPreviewMode && previewAssignment.questions?.length > 0" class="progress-section mt-6">
                  <v-card color="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" variant="flat" class="progress-card" rounded="xl">
                    <v-card-text class="pa-4">
                      <div class="d-flex justify-space-between align-center mb-3">
                        <div class="d-flex align-center">
                          <v-icon size="24" color="#1976d2" class="mr-2">mdi-chart-line</v-icon>
                          <h4 class="text-h6 font-weight-bold progress-title-text">Progress</h4>
                        </div>
                        <v-chip color="#1976d2" variant="flat" size="small" class="progress-chip">
                          <span class="text-white font-weight-bold">
                            {{ getResponseCompletionStatus().answered }}/{{ getResponseCompletionStatus().total }}
                          </span>
                        </v-chip>
                      </div>
                      
                      <v-progress-linear 
                        :model-value="getResponseCompletionStatus().percentage" 
                        color="#1976d2" 
                        height="12" 
                        rounded
                        class="progress-bar mb-2"
                        bg-color="#e3f2fd"
                      >
                        <template v-slot:default="{ value }">
                          <div class="progress-text">{{ Math.ceil(value) }}%</div>
                        </template>
                      </v-progress-linear>
                      
                      <p class="text-center text-body-2 font-weight-medium mb-0 progress-percentage-text">
                        {{ getResponseCompletionStatus().percentage }}% Complete
                      </p>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card-text>
            </div>
          </v-card>
        </div>

        <!-- Enhanced Questions Section -->
        <div v-if="previewAssignment.questions && previewAssignment.questions.length > 0" class="questions-section px-6 pb-6">
          <div class="section-header mb-6">
            <v-card color="linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)" variant="outlined" class="section-title-card" rounded="xl">
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <v-icon size="28" color="#6495ED" class="mr-3">mdi-clipboard-text</v-icon>
                    <h3 class="text-h5 font-weight-bold section-title-text">Assignment Questions</h3>
                  </div>
                  <v-chip color="#6495ED" variant="tonal" size="large" class="question-count-chip">
                    <v-icon start color="#6495ED">mdi-format-list-numbered</v-icon>
                    <span class="question-count-text">{{ previewAssignment.questions.length }} Question{{ previewAssignment.questions.length !== 1 ? 's' : '' }}</span>
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </div>
          
          <!-- Enhanced Question Cards -->
          <div v-for="(question, index) in previewAssignment.questions" :key="index" class="question-container mb-6">
            <v-card class="enhanced-question-card" elevation="12" rounded="xl">
              <!-- Question Header with Number Badge -->
              <div class="question-header-section">
                <v-card-text class="pa-0">
                  <div class="question-number-badge">
                    <v-chip size="large" color="#6495ED" variant="flat" class="question-chip">
                      <v-icon start color="white">mdi-numeric-{{ index + 1 }}-circle</v-icon>
                      <span class="text-white font-weight-bold">Question {{ index + 1 }}</span>
                    </v-chip>
                    <v-chip size="small" color="#ff9800" variant="flat" class="marks-chip ml-3">
                      <v-icon start size="16" color="white">mdi-star</v-icon>
                      <span class="text-white font-weight-bold">{{ question.marks || 1 }} Mark{{ (question.marks || 1) > 1 ? 's' : '' }}</span>
                    </v-chip>
                  </div>
                </v-card-text>
              </div>

              <v-card-text class="pa-6">
                <!-- Enhanced Question Text -->
                <div class="question-text-section mb-5">
                  <v-card color="linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%)" variant="outlined" class="question-text-card" rounded="lg">
                    <v-card-text class="pa-4">
                      <div class="d-flex align-start">
                        <v-icon size="20" color="#6495ED" class="mr-3 mt-1">mdi-help-circle-outline</v-icon>
                        <p class="text-h6 font-weight-medium question-text-black mb-0">{{ question.questionText }}</p>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>

                <!-- Enhanced Answer Section -->
                <div class="answer-section-container">
                  <v-card color="#fafffe" variant="outlined" class="answer-input-card" rounded="lg">
                    <v-card-text class="pa-5">
                      
                      <!-- Multiple Choice with Enhanced Design -->
                      <div v-if="question.questionType === 'multiple-choice'">
                        <div class="answer-type-header mb-4">
                          <v-chip color="#4caf50" variant="tonal" size="small">
                            <v-icon start size="16" color="#2e7d32">mdi-format-list-bulleted</v-icon>
                            <span class="chip-text-green">Multiple Choice</span>
                          </v-chip>
                          <p class="text-subtitle-1 font-weight-bold mt-2 mb-0 answer-instruction-text">Choose the correct answer:</p>
                        </div>
                        
                        <v-radio-group 
                          v-model="studentResponses[`q_${index}`]" 
                          :disabled="!isPreviewMode"
                          class="enhanced-radio-group"
                        >
                          <v-card
                            v-for="(option, optionIndex) in question.options"
                            :key="optionIndex"
                            class="option-card mb-3"
                            :class="{ 'selected-option': studentResponses[`q_${index}`] === optionIndex }"
                            variant="outlined"
                            rounded="lg"
                            @click="studentResponses[`q_${index}`] = optionIndex"
                          >
                            <v-card-text class="pa-4">
                              <v-radio
                                :value="optionIndex"
                                color="#6495ED"
                                class="option-radio"
                              >
                                <template v-slot:label>
                                  <div class="d-flex align-center">
                                    <v-chip 
                                      size="small" 
                                      color="#6495ED" 
                                      variant="tonal" 
                                      class="option-letter mr-3"
                                    >
                                      <span class="option-letter-text">{{ String.fromCharCode(65 + optionIndex) }}</span>
                                    </v-chip>
                                    <span class="text-body-1 font-weight-medium option-text-black">{{ option.text }}</span>
                                  </div>
                                </template>
                              </v-radio>
                            </v-card-text>
                          </v-card>
                        </v-radio-group>
                      </div>

                      <!-- True/False with Enhanced Design -->
                      <div v-else-if="question.questionType === 'true-false'">
                        <div class="answer-type-header mb-4">
                          <v-chip color="#ff9800" variant="tonal" size="small">
                            <v-icon start size="16" color="#f57c00">mdi-check-circle-outline</v-icon>
                            <span class="chip-text-orange">True or False</span>
                          </v-chip>
                          <p class="text-subtitle-1 font-weight-bold mt-2 mb-0 answer-instruction-text">Select the correct answer:</p>
                        </div>
                        
                        <v-row>
                          <v-col cols="6">
                            <v-card 
                              class="tf-option-card"
                              :class="{ 'selected-tf': studentResponses[`q_${index}`] === 'true' }"
                              variant="outlined"
                              rounded="lg"
                              @click="studentResponses[`q_${index}`] = 'true'"
                            >
                              <v-card-text class="pa-4 text-center">
                                <v-radio
                                  value="true"
                                  v-model="studentResponses[`q_${index}`]"
                                  color="#4caf50"
                                  class="tf-radio"
                                >
                                  <template v-slot:label>
                                    <div class="text-center">
                                      <v-icon size="32" color="#4caf50" class="mb-2">mdi-check-circle</v-icon>
                                      <p class="text-h6 font-weight-bold mb-0 tf-text-green">TRUE</p>
                                    </div>
                                  </template>
                                </v-radio>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col cols="6">
                            <v-card 
                              class="tf-option-card"
                              :class="{ 'selected-tf': studentResponses[`q_${index}`] === 'false' }"
                              variant="outlined"
                              rounded="lg"
                              @click="studentResponses[`q_${index}`] = 'false'"
                            >
                              <v-card-text class="pa-4 text-center">
                                <v-radio
                                  value="false"
                                  v-model="studentResponses[`q_${index}`]"
                                  color="#f44336"
                                  class="tf-radio"
                                >
                                  <template v-slot:label>
                                    <div class="text-center">
                                      <v-icon size="32" color="#f44336" class="mb-2">mdi-close-circle</v-icon>
                                      <p class="text-h6 font-weight-bold mb-0 tf-text-red">FALSE</p>
                                    </div>
                                  </template>
                                </v-radio>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </div>

                      <!-- Short Answer with Enhanced Design -->
                      <div v-else-if="question.questionType === 'short-answer'">
                        <div class="answer-type-header mb-4">
                          <v-chip color="#2196f3" variant="tonal" size="small">
                            <v-icon start size="16" color="#1976d2">mdi-text-short</v-icon>
                            <span class="chip-text-blue">Short Answer</span>
                          </v-chip>
                          <p class="text-subtitle-1 font-weight-bold mt-2 mb-0 answer-instruction-text">Write your answer:</p>
                        </div>
                        
                        <v-text-field
                          v-model="studentResponses[`q_${index}`]"
                          label="Your Answer"
                          variant="outlined"
                          placeholder="Type your short answer here..."
                          :disabled="!isPreviewMode"
                          color="black"
                          clearable
                          class="enhanced-text-field"
                          rounded="lg"
                        >
                          <template v-slot:prepend-inner>
                            <v-icon color="#6495ED">mdi-pencil</v-icon>
                          </template>
                        </v-text-field>
                      </div>

                      <!-- Long Answer with Enhanced Design -->
                      <div v-else-if="question.questionType === 'long-answer'">
                        <div class="answer-type-header mb-4">
                          <v-chip color="#9c27b0" variant="tonal" size="small">
                            <v-icon start size="16" color="#7b1fa2">mdi-text-long</v-icon>
                            <span class="chip-text-purple">Long Answer</span>
                          </v-chip>
                          <p class="text-subtitle-1 text-black font-weight-bold mt-2 mb-0 answer-instruction-text">Write your detailed answer:</p>
                        </div>
                        
                        <v-textarea
                          v-model="studentResponses[`q_${index}`]"
                          label="Your Answer"
                          variant="outlined"
                          rows="5"
                          placeholder="Type your detailed answer here..."
                          :disabled="!isPreviewMode"
                          color="black"
                          clearable
                          class="enhanced-textarea"
                          rounded="lg"
                        >
                          <template v-slot:prepend-inner>
                            <v-icon color="#6495ED">mdi-text</v-icon>
                          </template>
                        </v-textarea>
                      </div>

                      <!-- Enhanced Response Status -->
                      <div v-if="isPreviewMode" class="response-status mt-4">
                        <v-chip 
                          :color="isResponseValid(studentResponses[`q_${index}`], question.questionType) ? 'success' : 'warning'" 
                          size="small" 
                          variant="tonal"
                          class="status-chip"
                        >
                          <v-icon start size="16">
                            {{ isResponseValid(studentResponses[`q_${index}`], question.questionType) ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                          </v-icon>
                          <span class="status-text">{{ isResponseValid(studentResponses[`q_${index}`], question.questionType) ? 'Answered' : 'Not Answered' }}</span>
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Enhanced Action Buttons -->
          <div v-if="isPreviewMode" class="action-section mt-8">
            <v-card color="linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)" variant="flat" class="action-card" rounded="xl">
              <v-card-text class="pa-6">
                <v-alert color="info" variant="tonal" class="mb-6 preview-alert" rounded="lg">
                  <template v-slot:prepend>
                    <v-icon size="24" color="#1976d2">mdi-information</v-icon>
                  </template>
                  <div>
                    <p class="text-h6 font-weight-bold mb-1 alert-title-text">Preview Mode</p>
                    <p class="mb-0 alert-description-text">This is exactly how students will see and interact with this assignment.</p>
                  </div>
                </v-alert>
                
                <div class="text-center">
                  <v-btn
                    color="#ff9800"
                    variant="outlined"
                    size="x-large"
                    @click="saveAsDraft"
                    class="action-btn mr-4 mb-3"
                    rounded="xl"
                  >
                    <v-icon start size="20">mdi-content-save</v-icon>
                    <span class="btn-text-black">Save as Draft</span>
                  </v-btn>
                  <v-btn
                    color="#4caf50"
                    variant="flat"
                    size="x-large"
                    @click="submitAssignment"
                    class="action-btn mb-3"
                    rounded="xl"
                  >
                    <v-icon start size="20" color="white">mdi-send</v-icon>
                    <span class="text-white">Submit Assignment</span>
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <!-- Enhanced No Questions State -->
        <div v-else class="no-questions-section pa-8">
          <v-card color="linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)" variant="outlined" class="no-questions-card text-center pa-8" rounded="xl">
            <v-avatar size="80" color="#e0e0e0" class="mb-4">
              <v-icon size="40" color="#9e9e9e">mdi-help-circle-outline</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-3 no-questions-title">No Questions Added Yet</h3>
            <p class="text-body-1 mb-4 no-questions-description">This assignment doesn't have any questions. Add questions to make it interactive for students.</p>
            <v-btn
              color="#6495ED"
              variant="flat"
              size="large"
              @click="editAssignment(previewAssignment)"
              rounded="xl"
            >
              <v-icon start color="white">mdi-plus</v-icon>
              <span class="text-white">Add Questions</span>
            </v-btn>
          </v-card>
        </div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Enhanced Footer Actions -->
    <v-card-actions class="preview-footer pa-6">
      <v-btn 
        variant="outlined" 
        @click="closeAssignmentPreview"
        size="large"
        rounded="lg"
        class="footer-btn"
      >
        <v-icon start color="#424242">mdi-close</v-icon>
        <span class="footer-btn-text">Close Preview</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="#6495ED"
        variant="outlined"
        @click="editAssignment(previewAssignment)"
        size="large"
        rounded="lg"
        class="footer-btn mr-2"
      >
        <v-icon start color="#6495ED">mdi-pencil</v-icon>
        <span class="footer-btn-text">Edit Assignment</span>
      </v-btn>
      <v-btn
        color="#4caf50"
        variant="outlined"
        @click="viewSubmissions(previewAssignment)"
        size="large"
        rounded="lg"
        class="footer-btn mr-2"
      >
        <v-icon start color="#4caf50">mdi-clipboard-list</v-icon>
        <span class="footer-btn-text">View Submissions</span>
      </v-btn>
      <v-btn
        color="#6495ED"
        variant="flat"
        @click="openShareDialog(previewAssignment)"
        size="large"
        rounded="lg"
        class="footer-btn"
      >
        <v-icon start color="white">mdi-share</v-icon>
        <span class="text-white">Share Assignment</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

    <!-- Submissions View Dialog -->
    <v-dialog v-model="showSubmissionsDialog" max-width="1200px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold pa-6 pb-2" style="color: #6495ED;">
          <v-icon start>mdi-clipboard-list</v-icon>
          Submissions for "{{ submissionAssignment?.title }}"
          <v-spacer></v-spacer>
          <v-chip color="green" variant="tonal">
            {{ submissions.length }} Submission{{ submissions.length !== 1 ? 's' : '' }}
          </v-chip>
        </v-card-title>
        
        <v-divider></v-divider>

        <v-card-text class="pa-0" style="max-height: 70vh; overflow-y: auto;">
          <div v-if="submissionsLoading" class="text-center pa-8">
            <v-progress-circular indeterminate color="#6495ED" size="64"></v-progress-circular>
            <p class="text-body-2 text-grey mt-3">Loading submissions...</p>
          </div>

          <div v-else-if="submissions.length > 0">
            <!-- Submissions Summary -->
            <v-card color="#f8f9fa" variant="flat" class="ma-6 mb-4">
              <v-card-text class="pa-4">
                <v-row class="text-center">
                  <v-col cols="12" md="3">
                    <div class="stat-item">
                      <v-icon color="green" size="24" class="mb-1">mdi-check-circle</v-icon>
                      <p class="text-caption text-grey mb-0">Submitted</p>
                      <p class="text-h6 font-weight-bold mb-0" style="color: green;">
                        {{ submissions.filter(s => s.status === 'submitted').length }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="stat-item">
                      <v-icon color="orange" size="24" class="mb-1">mdi-clock</v-icon>
                      <p class="text-caption text-grey mb-0">Pending</p>
                      <p class="text-h6 font-weight-bold mb-0" style="color: orange;">
                        {{ submissions.filter(s => s.status === 'draft').length }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="stat-item">
                      <v-icon color="blue" size="24" class="mb-1">mdi-star</v-icon>
                      <p class="text-caption text-grey mb-0">Average Score</p>
                      <p class="text-h6 font-weight-bold mb-0" style="color: blue;">
                        {{ calculateAverageScore() }}%
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="stat-item">
                      <v-icon color="purple" size="24" class="mb-1">mdi-chart-line</v-icon>
                      <p class="text-caption text-grey mb-0">Completion</p>
                      <p class="text-h6 font-weight-bold mb-0" style="color: purple;">
                        {{ Math.round((submissions.filter(s => s.status === 'submitted').length / (selectedClassInfo?.studentCount || 1)) * 100) }}%
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Individual Submissions -->
            <div class="px-6">
              <div v-for="(submission, index) in submissions" :key="submission.id" class="mb-4">
                <v-card variant="outlined" class="submission-card">
                  <v-card-title class="pa-4 pb-2">
                    <div class="d-flex justify-space-between align-center w-100">
                      <div class="d-flex align-center">
                        <v-avatar color="#6495ED" size="40" class="mr-3">
                          <v-icon color="white">mdi-account</v-icon>
                        </v-avatar>
                        <div>
                          <h5 class="text-h6 font-weight-bold mb-0">{{ submission.studentName || `Student ${index + 1}` }}</h5>
                          <p class="text-caption text-grey mb-0">
                            Submitted on {{ formatDate(submission.submittedAt) }}
                          </p>
                        </div>
                      </div>
                      <div class="d-flex align-center">
                        <v-chip
                          :color="getSubmissionStatusColor(submission.status)"
                          size="small"
                          variant="flat"
                          class="mr-2"
                        >
                          {{ submission.status === 'submitted' ? 'Submitted' : 'Draft' }}
                        </v-chip>
                        <v-chip
                          color="blue"
                          variant="tonal"
                          size="small"
                        >
                          {{ submission.score || 0 }}/{{ submissionAssignment?.maxMarks || 0 }}
                        </v-chip>
                      </div>
                    </div>
                  </v-card-title>

                  <v-card-text class="pa-4 pt-0">
                    <v-expansion-panels variant="accordion">
                      <v-expansion-panel>
                        <v-expansion-panel-title>
                          <v-icon start>mdi-eye</v-icon>
                          View Responses ({{ Object.keys(submission.responses || {}).length }} answers)
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div v-if="submission.responses">
                            <div v-for="(response, questionIndex) in submission.responses" :key="questionIndex" class="mb-4">
                              <div class="d-flex justify-space-between align-center mb-2">
                                <h6 class="text-subtitle-2 font-weight-bold">
                                  Question {{ parseInt(questionIndex.replace('q_', '')) + 1 }}
                                </h6>
                                <v-chip size="x-small" color="grey" variant="tonal">
                                  {{ submissionAssignment?.questions?.[parseInt(questionIndex.replace('q_', ''))]?.marks || 1 }} mark(s)
                                </v-chip>
                              </div>
                              <p class="text-body-2 mb-2">
                                {{ submissionAssignment?.questions?.[parseInt(questionIndex.replace('q_', ''))]?.questionText }}
                              </p>
                              <v-card color="#f8f9fa" variant="flat" class="pa-3">
                                <p class="text-body-2 mb-0">
                                  <strong>Answer:</strong> {{ formatStudentResponse(response, submissionAssignment?.questions?.[parseInt(questionIndex.replace('q_', ''))]) }}
                                </p>
                              </v-card>
                            </div>
                          </div>
                          <div v-else class="text-center pa-4">
                            <p class="text-body-2 text-grey">No responses recorded</p>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>

                  <v-card-actions class="pa-4">
                    <v-btn
                      color="blue"
                      variant="outlined"
                      size="small"
                      @click="gradeSubmission(submission)"
                    >
                      <v-icon start>mdi-star</v-icon>
                      Grade
                    </v-btn>
                    <v-btn
                      color="green"
                      variant="outlined"
                      size="small"
                      @click="provideFeedback(submission)"
                      class="ml-2"
                    >
                      <v-icon start>mdi-comment</v-icon>
                      Feedback
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="orange"
                      variant="text"
                      size="small"
                      @click="downloadSubmission(submission)"
                    >
                      <v-icon start>mdi-download</v-icon>
                      Download
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </div>
          </div>

          <!-- No Submissions State -->
          <div v-else class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-2">mdi-clipboard-outline</v-icon>
            <h4 class="text-h6 mt-3 text-grey">No submissions yet</h4>
            <p class="text-body-2 text-grey mb-4">
              Students haven't submitted this assignment yet.
            </p>
            <v-btn
              color="#6495ED"
              variant="outlined"
              @click="openShareDialog(submissionAssignment)"
            >
              <v-icon start>mdi-share</v-icon>
              Share Assignment Link
            </v-btn>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-btn variant="outlined" @click="closeSubmissionsView">
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green"
            variant="outlined"
            @click="exportSubmissions"
          >
            <v-icon start>mdi-file-export</v-icon>
            Export Results
          </v-btn>
          <v-btn
            color="#6495ED"
            variant="flat"
            @click="refreshSubmissions"
            :loading="submissionsLoading"
          >
            <v-icon start>mdi-refresh</v-icon>
            Refresh
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showShareDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
          <v-icon start>mdi-share</v-icon>
          Share Assignment: {{ assignmentToShare?.title }}
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-alert color="info" variant="tonal" class="mb-4">
            <v-icon start>mdi-information</v-icon>
            Share this assignment with your students using the methods below.
          </v-alert>

          <!-- Assignment Link -->
          <div class="mb-4">
            <h5 class="text-subtitle-1 font-weight-bold mb-2">Assignment Link</h5>
            <v-text-field
              :value="generateAssignmentLink(assignmentToShare)"
              label="Assignment URL"
              variant="outlined"
              readonly
              append-inner-icon="mdi-content-copy"
              @click:append-inner="copyToClipboard(generateAssignmentLink(assignmentToShare))"
              class="mb-2"
            ></v-text-field>
            <p class="text-caption text-grey">Students can access this assignment directly using this link.</p>
          </div>

          <!-- QR Code Section -->
          <div class="mb-4">
            <h5 class="text-subtitle-1 font-weight-bold mb-2">QR Code</h5>
            <div class="text-center mb-2">
              <div 
                ref="qrCode" 
                class="qr-code-container d-inline-block pa-4"
                style="border: 2px solid #e0e0e0; border-radius: 8px; background: white;"
              >
                <!-- QR Code will be generated here -->
                <div class="qr-placeholder" style="width: 200px; height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
                  <div class="text-center">
                    <v-icon size="48" color="grey">mdi-qrcode</v-icon>
                    <p class="text-caption text-grey mt-2">QR Code</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-caption text-grey text-center">Students can scan this QR code to access the assignment.</p>
          </div>

          <!-- Assignment Code -->
          <div class="mb-4">
            <h5 class="text-subtitle-1 font-weight-bold mb-2">Assignment Code</h5>
            <v-card color="#e3f2fd" class="pa-4 text-center">
              <h2 class="text-h3 font-weight-bold" style="color: #1976d2; letter-spacing: 4px;">
                {{ generateAssignmentCode(assignmentToShare) }}
              </h2>
              <p class="text-body-2 mt-2">Share this code with your students</p>
              <v-btn
                color="#1976d2"
                variant="outlined"
                size="small"
                @click="copyToClipboard(generateAssignmentCode(assignmentToShare))"
                class="mt-2"
              >
                <v-icon start>mdi-content-copy</v-icon>
                Copy Code
              </v-btn>
            </v-card>
          </div>

          <!-- Email/Message Template -->
          <div class="mb-4">
            <h5 class="text-subtitle-1 font-weight-bold mb-2">Message Template</h5>
            <v-textarea
              :value="generateMessageTemplate(assignmentToShare)"
              label="Copy this message to share with students"
              variant="outlined"
              rows="4"
              readonly
              append-inner-icon="mdi-content-copy"
              @click:append-inner="copyToClipboard(generateMessageTemplate(assignmentToShare))"
            ></v-textarea>
            <p class="text-caption text-grey">Copy this template to send via email, WhatsApp, or any messaging platform.</p>
          </div>

          <!-- Social Share Options -->
          <div class="mb-4">
            <h5 class="text-subtitle-1 font-weight-bold mb-2">Quick Share</h5>
            <v-row>
              <v-col cols="6" md="3">
                <v-btn
                  color="#25D366"
                  variant="flat"
                  block
                  @click="shareViaWhatsApp(assignmentToShare)"
                  class="text-white"
                >
                  <v-icon start>mdi-whatsapp</v-icon>
                  WhatsApp
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  color="#1976d2"
                  variant="flat"
                  block
                  @click="shareViaEmail(assignmentToShare)"
                  class="text-white"
                >
                  <v-icon start>mdi-email</v-icon>
                  Email
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  color="#1DA1F2"
                  variant="flat"
                  block
                  @click="shareViaTwitter(assignmentToShare)"
                  class="text-white"
                >
                  <v-icon start>mdi-twitter</v-icon>
                  Twitter
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  color="#0088cc"
                  variant="flat"
                  block
                  @click="shareViaTelegram(assignmentToShare)"
                  class="text-white"
                >
                  <v-icon start>mdi-telegram</v-icon>
                  Telegram
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="closeShareDialog">
            Close
          </v-btn>
          <v-btn
            color="#6495ED"
            variant="flat"
            @click="downloadQRCode"
          >
            <v-icon start>mdi-download</v-icon>
            Download QR Code
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Classes List Dialog -->
    <v-dialog v-model="showClassesList" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
          <v-icon start>mdi-school</v-icon>
          All Classes ({{ classes.length }})
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-list v-if="classes.length > 0">
            <v-list-item
              v-for="(classItem, index) in classes"
              :key="classItem.id"
              class="class-list-item"
              @click="selectClassFromList(classItem.id)"
            >
              <template v-slot:prepend>
                <v-avatar :color="getClassColor(index)" size="40">
                  <v-icon color="white">{{ classItem.icon }}</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-medium">
                {{ classItem.name }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                {{ classItem.studentCount }} students • Created {{ formatDate(classItem.createdAt) }}
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <v-chip size="small" :color="getClassColor(index)" variant="tonal">
                  {{ classItem.studentCount }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          
          <div v-else class="pa-6 text-center">
            <v-icon size="64" color="grey-lighten-2">mdi-school-outline</v-icon>
            <p class="text-h6 mt-3 text-grey">No classes created yet</p>
            <v-btn color="#6495ED" variant="outlined" @click="showAddClassDialog = true; showClassesList = false">
              Create First Class
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showClassesList = false">Close</v-btn>
          <v-btn color="#6495ED" variant="flat" @click="showAddClassDialog = true; showClassesList = false">
            Add New Class
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Students List Dialog -->
    <v-dialog v-model="showStudentsList" max-width="700px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold" style="color: #6495ED;">
          <v-icon start>mdi-account-group</v-icon>
          All Students ({{ totalStudents }})
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-list v-if="classes.length > 0">
            <template v-for="(classItem, index) in classes" :key="classItem.id">
              <v-list-subheader class="text-primary font-weight-bold">
                {{ classItem.name }} ({{ classItem.studentCount }} students)
              </v-list-subheader>
              
              <v-list-item
                class="student-list-item pl-8"
                @click="selectClassFromList(classItem.id)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getClassColor(index)" size="32">
                    <v-icon color="white" size="20">{{ classItem.icon }}</v-icon>
                  </v-avatar>
                </template>
                
                <v-list-item-title>
                  {{ classItem.studentCount }} Students in {{ classItem.name }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  Class created on {{ formatDate(classItem.createdAt) }}
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-btn
                    icon="mdi-arrow-right"
                    size="small"
                    variant="text"
                    color="#6495ED"
                  ></v-btn>
                </template>
              </v-list-item>
              
              <v-divider v-if="index < classes.length - 1" class="my-2"></v-divider>
            </template>
          </v-list>
          
          <div v-else class="pa-6 text-center">
            <v-icon size="64" color="grey-lighten-2">mdi-account-group-outline</v-icon>
            <p class="text-h6 mt-3 text-grey">No students found</p>
            <p class="text-body-2 text-grey">Create a class first to add students</p>
            <v-btn color="#6495ED" variant="outlined" @click="showAddClassDialog = true; showStudentsList = false">
              Create Class
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showStudentsList = false">Close</v-btn>
          <v-btn color="#6495ED" variant="flat" @click="showAddClassDialog = true; showStudentsList = false">
            Add New Class
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Class Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold" style="color: #d32f2f;">
          <v-icon start color="red">mdi-delete-alert</v-icon>
          Delete Class
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-alert color="warning" variant="tonal" class="mb-4">
            <v-icon start>mdi-alert-triangle</v-icon>
            This action cannot be undone!
          </v-alert>
          
          <p class="text-body-1">
            Are you sure you want to delete <strong>"{{ classToDelete?.name }}"</strong>?
          </p>
          <p class="text-body-2 text-grey-darken-1">
            This will permanently remove the class and all its data.
          </p>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="cancelDelete"
            :disabled="deleteLoading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            variant="flat"
            @click="deleteClass"
            :loading="deleteLoading"
          >
            Delete Class
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessMessage"
      color="success"
      timeout="3000"
      location="top"
    >
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showSuccessMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorMessage"
      color="error"
      timeout="4000"
      location="top"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showErrorMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
definePageMeta({
    middleware: 'auth'
})

export default {
    name: 'TeacherDashboard',
    data() {
        return {
            drawer: true,
            selectedClass: 'default', // Default to overview
            classes: [], // This will now be populated from API
            showAddClassDialog: false,
            addClassValid: false,
            addClassLoading: false,
            showSuccessMessage: false,
            showErrorMessage: false,
            successMessage: '',
            errorMessage: '',
            // Delete class related data
            showDeleteDialog: false,
            deleteLoading: false,
            classToDelete: null,
            // List dialogs
            showClassesList: false,
            showStudentsList: false,
            showAssignmentsList: false,
            // Share dialog
            showShareDialog: false,
            assignmentToShare: null,
            // Assignment preview and submission dialogs
            showAssignmentPreviewDialog: false,
            showSubmissionsDialog: false,
            previewAssignment: null,
            submissionAssignment: null,
            submissions: [],
            submissionsLoading: false,
            // Student response simulation
            studentResponses: {},
            isPreviewMode: true,
            // Assignment creation
            showAssignmentDialog: false,
            assignmentStep: 1,
            assignmentBasicValid: false,
            assignmentLoading: false,
            isEditMode: false,
            editingAssignmentId: null,
            assignments: [], // Store assignments for current class
            assignmentData: {
                subject: '',
                chapter: '',
                title: '',
                description: '',
                dueDate: '',
                maxMarks: '',
                questions: [
                    {
                        questionText: '',
                        questionType: 'multiple-choice',
                        marks: 1,
                        options: [
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false }
                        ],
                        correctAnswer: null
                    }
                ]
            },
            assignmentsLoading: false,
            questionTypes: [
                { title: 'Multiple Choice', value: 'multiple-choice' },
                { title: 'Short Answer', value: 'short-answer' },
                { title: 'Long Answer', value: 'long-answer' },
                { title: 'True/False', value: 'true-false' }
            ],
            subjectRules: [
                v => !!v || 'Subject is required',
                v => (v && v.length >= 2) || 'Subject must be at least 2 characters'
            ],
            chapterRules: [
                v => !!v || 'Chapter is required',
                v => (v && v.length >= 2) || 'Chapter must be at least 2 characters'
            ],
            titleRules: [
                v => !!v || 'Assignment title is required',
                v => (v && v.length >= 3) || 'Title must be at least 3 characters'
            ],
            newClass: {
                name: '',
                studentCount: null
            },
            classNameRules: [
                v => !!v || 'Class name is required',
                v => (v && v.length >= 2) || 'Class name must be at least 2 characters',
                v => (v && v.length <= 50) || 'Class name must be less than 50 characters'
            ],
            studentCountRules: [
                v => !!v || 'Student count is required',
                v => (v && v > 0) || 'Student count must be greater than 0',
                v => (v && v <= 100) || 'Student count must be less than 100'
            ],
            menuItems: [
                {
                    id: 'profile',
                    name: 'Profile',
                    icon: 'mdi-account-circle',
                    action: 'profile'
                },
                {
                    id: 'settings',
                    name: 'Settings',
                    icon: 'mdi-cog',
                    action: 'settings'
                },
                {
                    id: 'reports',
                    name: 'Reports',
                    icon: 'mdi-chart-line',
                    action: 'reports'
                }
            ]
        }
    },
    computed: {
        currentUser() {
            if (process.client) {
                const session = localStorage.getItem('teacherSession')
                if (session) {
                    try {
                        const sessionData = JSON.parse(session)
                        console.log('Current user data from session:', sessionData.user) // Debug log
                        return sessionData.user
                    } catch (error) {
                        console.error('Error parsing session data:', error)
                        return null
                    }
                }
            }
            return null
        },
        selectedClassInfo() {
            return this.classes.find(c => c.id === this.selectedClass)
        },
        totalStudents() {
            return this.classes.reduce((total, cls) => total + (cls.studentCount || 0), 0)
        },
        canCreateAssignment() {
            return this.assignmentData.subject && 
                   this.assignmentData.chapter && 
                   this.assignmentData.title && 
                   this.assignmentData.questions.length > 0 &&
                   this.assignmentData.questions.every(q => q.questionText.trim() !== '')
        }
    },
    methods: {
      // Add these enhanced methods to your existing Vue component methods section

viewAssignment(assignment) {
    console.log('📖 View assignment:', assignment)
    this.viewAssignmentPreview(assignment)
},

viewAssignmentPreview(assignment) {
    console.log('📖 Opening assignment preview:', assignment.title)
    
    // Set the assignment data for preview
    this.previewAssignment = assignment
    this.studentResponses = {} // Reset responses
    this.isPreviewMode = true
    this.showAssignmentPreviewDialog = true
    
    // Initialize empty responses for preview based on question types
    if (assignment.questions && assignment.questions.length > 0) {
        assignment.questions.forEach((question, index) => {
            const responseKey = `q_${index}`
            
            // Initialize responses based on question type
            switch (question.questionType) {
                case 'multiple-choice':
                    this.studentResponses[responseKey] = null // Will store option index
                    break
                case 'true-false':
                    this.studentResponses[responseKey] = null // Will store 'true' or 'false'
                    break
                case 'short-answer':
                case 'long-answer':
                    this.studentResponses[responseKey] = '' // Empty string for text responses
                    break
                default:
                    this.studentResponses[responseKey] = ''
            }
        })
    }
    
    // Calculate total marks from questions if not set
    if (!assignment.maxMarks && !assignment.calculatedMarks && assignment.questions) {
        const totalMarks = assignment.questions.reduce((total, question) => {
            return total + (parseInt(question.marks) || 1)
        }, 0)
        
        // Set calculated marks for display
        assignment.calculatedMarks = totalMarks
    }
    
    console.log('✅ Assignment preview initialized with responses:', this.studentResponses)
},

closeAssignmentPreview() {
    this.showAssignmentPreviewDialog = false
    this.previewAssignment = null
    this.studentResponses = {}
    this.isPreviewMode = false
},

saveAsDraft() {
    console.log('💾 Saving assignment as draft...')
    console.log('Student responses:', this.studentResponses)
    
    // Count answered questions
    const answeredQuestions = Object.values(this.studentResponses).filter(response => {
        if (typeof response === 'string') {
            return response.trim() !== ''
        }
        return response !== null && response !== undefined
    }).length
    
    this.showSuccess(`Assignment saved as draft! (Preview mode - ${answeredQuestions} questions answered)`)
},

submitAssignment() {
    console.log('📤 Submitting assignment...')
    console.log('Student responses:', this.studentResponses)
    
    // Validate that at least some questions are answered
    const answeredQuestions = Object.values(this.studentResponses).filter(response => {
        if (typeof response === 'string') {
            return response.trim() !== ''
        }
        return response !== null && response !== undefined
    }).length
    
    if (answeredQuestions === 0) {
        this.showError('Please answer at least one question before submitting.')
        return
    }
    
    // Calculate completion percentage
    const totalQuestions = this.previewAssignment?.questions?.length || 0
    const completionPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
    
    // Simulate submission
    this.showSuccess(`Assignment submitted successfully! (Preview mode - ${answeredQuestions}/${totalQuestions} questions answered - ${completionPercentage}% complete)`)
    this.closeAssignmentPreview()
},

formatStudentResponse(response, question) {
    if (!question) return response
    
    // Handle different question types for display
    if (question.questionType === 'multiple-choice' && question.options) {
        const optionIndex = parseInt(response)
        if (!isNaN(optionIndex) && question.options[optionIndex]) {
            return question.options[optionIndex].text || `Option ${optionIndex + 1}`
        }
        return `Option ${optionIndex + 1}` || 'No answer'
    }
    
    if (question.questionType === 'true-false') {
        if (response === 'true') return 'True'
        if (response === 'false') return 'False'
        return 'No answer'
    }
    
    // For short-answer and long-answer
    if (typeof response === 'string') {
        return response.trim() || 'No answer'
    }
    
    return response || 'No answer'
},

// Enhanced method to get preview assignment total marks
getPreviewAssignmentMarks() {
    if (!this.previewAssignment) return 0
    
    // Check for explicitly set marks
    if (this.previewAssignment.maxMarks) {
        return this.previewAssignment.maxMarks
    }
    
    if (this.previewAssignment.calculatedMarks) {
        return this.previewAssignment.calculatedMarks
    }
    
    // Calculate from questions
    if (this.previewAssignment.questions && this.previewAssignment.questions.length > 0) {
        return this.previewAssignment.questions.reduce((total, question) => {
            return total + (parseInt(question.marks) || 1)
        }, 0)
    }
    
    return 0
},

// Method to check if a response is valid
isResponseValid(response, questionType) {
    switch (questionType) {
        case 'multiple-choice':
        case 'true-false':
            return response !== null && response !== undefined
        case 'short-answer':
        case 'long-answer':
            return typeof response === 'string' && response.trim() !== ''
        default:
            return response !== null && response !== undefined && response !== ''
    }
},

// Method to get response completion status
getResponseCompletionStatus() {
    if (!this.previewAssignment?.questions) return { answered: 0, total: 0, percentage: 0 }
    
    const total = this.previewAssignment.questions.length
    const answered = this.previewAssignment.questions.filter((question, index) => {
        const response = this.studentResponses[`q_${index}`]
        return this.isResponseValid(response, question.questionType)
    }).length
    
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0
    
    return { answered, total, percentage }
},
        async loadClasses() {
            try {
                const teacherId = this.currentUser?.id
                if (!teacherId) {
                    console.error('No teacher ID found in session')
                    console.log('Current user:', this.currentUser)
                    return
                }

                console.log('Loading classes for teacher ID:', teacherId)

                const response = await $fetch('/api/classes', {
                    method: 'GET',
                    query: { teacherId: String(teacherId) }
                })

                if (response.success) {
                    this.classes = response.classes || []
                    console.log('✅ Successfully loaded classes:', this.classes)
                    
                    // If no classes found but we expected some, show debug info
                    if (this.classes.length === 0) {
                        console.log('⚠️ No classes found for teacher. This could be normal for new teachers.')
                    }
                } else {
                    console.error('❌ API response was not successful:', response)
                    this.showError('Failed to load classes')
                }
            } catch (error) {
                console.error('❌ Error loading classes:', error)
                this.showError('Failed to load classes. Please refresh the page.')
            }
        },

        async loadAssignments() {
            if (!this.selectedClassInfo) return

            this.assignmentsLoading = true
            
            try {
                const teacherId = this.currentUser?.id
                const classId = this.selectedClassInfo?.id

                if (!teacherId || !classId) {
                    console.error('Teacher ID or Class ID not found')
                    return
                }

                console.log('Loading assignments for class:', classId)

                const response = await $fetch('/api/assignments', {
                    method: 'GET',
                    query: { 
                        classId: String(classId),
                        teacherId: String(teacherId)
                    }
                })

                if (response.success) {
                    this.assignments = response.assignments || []
                    console.log('✅ Successfully loaded assignments:', this.assignments.length)
                } else {
                    console.error('❌ Failed to load assignments:', response)
                    this.assignments = []
                }
            } catch (error) {
                console.error('❌ Error loading assignments:', error)
                this.showError('Failed to load assignments')
                this.assignments = []
            } finally {
                this.assignmentsLoading = false
            }
        },

        isOverdue(dueDate) {
            if (!dueDate) return false
            return new Date(dueDate) < new Date()
        },

        isPastDue(dueDate) {
            if (!dueDate) return false
            const due = new Date(dueDate)
            const now = new Date()
            const diffTime = due - now
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 3 && diffDays >= 0
        },

        getAssignmentStatusColor(status) {
            const colors = {
                'active': 'green',
                'draft': 'orange',
                'closed': 'red',
                'completed': 'blue'
            }
            return colors[status?.toLowerCase()] || 'grey'
        },

        viewAssignment(assignment) {
            console.log('View assignment:', assignment)
            // TODO: Implement assignment view dialog
            this.showError('Assignment view coming soon!')
        },

        editAssignment(assignment) {
            console.log('Edit assignment:', assignment)
            this.isEditMode = true
            this.editingAssignmentId = assignment.id
            
            // Populate form with assignment data
            this.assignmentData = {
                subject: assignment.subject || '',
                chapter: assignment.chapter || '',
                title: assignment.title || '',
                description: assignment.description || '',
                dueDate: assignment.dueDate || '',
                maxMarks: assignment.maxMarks || assignment.calculatedMarks || '',
                questions: assignment.questions ? JSON.parse(JSON.stringify(assignment.questions)) : [
                    {
                        questionText: '',
                        questionType: 'multiple-choice',
                        marks: 1,
                        options: [
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false }
                        ],
                        correctAnswer: null
                    }
                ]
            }
            
            // Ensure questions have proper structure
            this.assignmentData.questions = this.assignmentData.questions.map(q => ({
                questionText: q.questionText || '',
                questionType: q.questionType || 'multiple-choice',
                marks: q.marks || 1,
                options: q.options || [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ],
                correctAnswer: q.correctAnswer || null
            }))
            
            this.showAssignmentDialog = true
            this.assignmentStep = 1
        },

        deleteAssignment(assignment) {
            if (confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
                console.log('Delete assignment:', assignment)
                // TODO: Implement assignment delete functionality
                this.showError('Assignment delete coming soon!')
            }
        },

        viewSubmissions(assignment) {
            console.log('View submissions for:', assignment)
            // TODO: Implement submissions view
            this.showError('Submissions view coming soon!')
        },

        // Enhanced share functionality
        openShareDialog(assignment) {
            this.assignmentToShare = assignment
            this.showShareDialog = true
            // Generate QR code when dialog opens
            this.$nextTick(() => {
                this.generateQRCode(assignment)
            })
        },

        closeShareDialog() {
            this.showShareDialog = false
            this.assignmentToShare = null
        },

        generateAssignmentLink(assignment) {
            if (!assignment) return ''
            const baseUrl = process.client ? window.location.origin : 'https://yourschool.com'
            return `${baseUrl}/student/assignment/${assignment.id}?code=${this.generateAssignmentCode(assignment)}`
        },

        generateAssignmentCode(assignment) {
            if (!assignment) return ''
            // Generate a 6-character code based on assignment ID
            const code = assignment.id.toString().slice(-6).toUpperCase()
            return code.padStart(6, '0')
        },

        generateMessageTemplate(assignment) {
            if (!assignment) return ''
            const link = this.generateAssignmentLink(assignment)
            const code = this.generateAssignmentCode(assignment)
            
            return `📚 New Assignment Alert!

Subject: ${assignment.subject}
Chapter: ${assignment.chapter}
Title: ${assignment.title}

${assignment.description ? `Description: ${assignment.description}` : ''}

📅 Due Date: ${assignment.dueDate ? this.formatDate(assignment.dueDate) : 'Not specified'}
⭐ Max Marks: ${assignment.maxMarks || 'TBD'}
❓ Questions: ${assignment.questions?.length || 0}

🔗 Access Link: ${link}

📱 Assignment Code: ${code}

Good luck with your assignment! 🎓`
        },

        async copyToClipboard(text) {
            try {
                if (process.client && navigator.clipboard) {
                    await navigator.clipboard.writeText(text)
                    this.showSuccess('Copied to clipboard!')
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea')
                    textArea.value = text
                    document.body.appendChild(textArea)
                    textArea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textArea)
                    this.showSuccess('Copied to clipboard!')
                }
            } catch (error) {
                console.error('Failed to copy to clipboard:', error)
                this.showError('Failed to copy to clipboard')
            }
        },

        generateQRCode(assignment) {
            if (!process.client || !this.$refs.qrCode) return
            
            const link = this.generateAssignmentLink(assignment)
            
            // Simple QR code placeholder - in real implementation, you'd use a QR code library
            const qrContainer = this.$refs.qrCode.querySelector('.qr-placeholder')
            if (qrContainer) {
                qrContainer.innerHTML = `
                    <div style="width: 200px; height: 200px; background: url('data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f5f5f5"/><text x="100" y="100" text-anchor="middle" fill="%23666" font-size="12">QR Code for<br/>Assignment</text></svg>') center/cover;">
                    </div>
                `
            }
            
            // Note: In a real implementation, you would use a library like qrcode.js:
            // import QRCode from 'qrcode'
            // QRCode.toCanvas(this.$refs.qrCode, link, { width: 200 })
        },

        downloadQRCode() {
            // Placeholder for QR code download functionality
            this.showError('QR Code download coming soon!')
            // In real implementation, you would convert the QR code to an image and download it
        },

        shareViaWhatsApp(assignment) {
            const message = encodeURIComponent(this.generateMessageTemplate(assignment))
            const url = `https://wa.me/?text=${message}`
            window.open(url, '_blank')
        },

        shareViaEmail(assignment) {
            const subject = encodeURIComponent(`Assignment: ${assignment.title}`)
            const body = encodeURIComponent(this.generateMessageTemplate(assignment))
            const url = `mailto:?subject=${subject}&body=${body}`
            window.open(url)
        },

        shareViaTwitter(assignment) {
            const text = encodeURIComponent(`New assignment: ${assignment.title} - ${assignment.subject}`)
            const url = encodeURIComponent(this.generateAssignmentLink(assignment))
            const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
            window.open(twitterUrl, '_blank')
        },

        shareViaTelegram(assignment) {
            const message = encodeURIComponent(this.generateMessageTemplate(assignment))
            const url = `https://t.me/share/url?text=${message}`
            window.open(url, '_blank')
        },

        async addNewClass() {
            const { valid } = await this.$refs.addClassForm.validate()
            
            if (!valid) {
                this.showError('Please fill in all required fields correctly.')
                return
            }

            this.addClassLoading = true

            try {
                const teacherId = this.currentUser?.id
                if (!teacherId) {
                    throw new Error('Teacher ID not found in session')
                }

                console.log('Adding new class for teacher ID:', teacherId)

                const response = await $fetch('/api/classes', {
                    method: 'POST',
                    body: {
                        className: this.newClass.name.trim(),
                        studentCount: parseInt(this.newClass.studentCount),
                        teacherId: String(teacherId)
                    }
                })

                if (response.success) {
                    this.showSuccess('Class added successfully!')
                    
                    // Add the new class to local array
                    this.classes.push(response.class)
                    
                    // Close dialog and reset form
                    this.cancelAddClass()
                    
                    console.log('✅ Class added successfully:', response.class)
                    console.log('✅ Total classes now:', this.classes.length)
                } else {
                    this.showError('Failed to add class. Please try again.')
                }
            } catch (error) {
                console.error('❌ Error adding class:', error)
                if (error.statusCode === 400) {
                    this.showError(error.statusMessage || 'Class already exists or invalid data')
                } else {
                    this.showError('Failed to add class. Please try again.')
                }
            } finally {
                this.addClassLoading = false
            }
        },

        cancelAddClass() {
            this.showAddClassDialog = false
            this.newClass = {
                name: '',
                studentCount: null
            }
            if (this.$refs.addClassForm) {
                this.$refs.addClassForm.reset()
                this.$refs.addClassForm.resetValidation()
            }
        },

        showSuccess(message) {
            this.successMessage = message
            this.showSuccessMessage = true
        },

        showError(message) {
            this.errorMessage = message
            this.showErrorMessage = true
        },

        confirmDeleteClass(classItem) {
            this.classToDelete = classItem
            this.showDeleteDialog = true
        },

        cancelDelete() {
            this.showDeleteDialog = false
            this.classToDelete = null
            this.deleteLoading = false
        },

        async deleteClass() {
            if (!this.classToDelete) return

            this.deleteLoading = true

            try {
                const teacherId = this.currentUser?.id
                if (!teacherId) {
                    throw new Error('Teacher ID not found in session')
                }

                console.log('Deleting class:', this.classToDelete.id)

                const response = await $fetch('/api/classes', {
                    method: 'DELETE',
                    body: {
                        classId: this.classToDelete.id,
                        teacherId: String(teacherId)
                    }
                })

                if (response.success) {
                    this.showSuccess(`Class "${this.classToDelete.name}" deleted successfully!`)
                    
                    // Remove class from local array
                    this.classes = this.classes.filter(c => c.id !== this.classToDelete.id)
                    
                    // If the deleted class was selected, go back to dashboard
                    if (this.selectedClass === this.classToDelete.id) {
                        this.selectedClass = 'default'
                    }
                    
                    // Close dialog
                    this.cancelDelete()
                    
                    console.log('✅ Class deleted successfully')
                    console.log('✅ Remaining classes:', this.classes.length)
                } else {
                    this.showError('Failed to delete class. Please try again.')
                }
            } catch (error) {
                console.error('❌ Error deleting class:', error)
                if (error.statusCode === 404) {
                    this.showError('Class not found or already deleted.')
                } else if (error.statusCode === 400) {
                    this.showError('You do not have permission to delete this class.')
                } else {
                    this.showError('Failed to delete class. Please try again.')
                }
            } finally {
                this.deleteLoading = false
            }
        },

        backToDashboard() {
            this.selectedClass = 'default'
        },

        selectClass(classId) {
            this.selectedClass = classId
            // Load assignments when class is selected
            if (classId !== 'default') {
                this.loadAssignments()
            }
            console.log(`Selected class: ${classId}`)
        },

        selectClassFromList(classId) {
            this.selectedClass = classId
            this.showClassesList = false
            this.showStudentsList = false
            // Load assignments when class is selected
            if (classId !== 'default') {
                this.loadAssignments()
            }
            console.log(`Selected class from list: ${classId}`)
        },

        getClassColor(index) {
            const colors = ['#1976d2', '#7b1fa2', '#388e3c', '#f57c00', '#d32f2f', '#00695c']
            return colors[index % colors.length]
        },

        formatDate(dateString) {
            if (!dateString) return 'Unknown'
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })
        },

        openAssignmentForm() {
            if (!this.selectedClassInfo) {
                this.showError('Please select a class first')
                return
            }
            this.isEditMode = false
            this.editingAssignmentId = null
            this.resetAssignmentData()
            this.showAssignmentDialog = true
            this.assignmentStep = 1
        },

        cancelAssignment() {
            this.showAssignmentDialog = false
            this.assignmentStep = 1
            this.isEditMode = false
            this.editingAssignmentId = null
            this.resetAssignmentData()
        },

        resetAssignmentData() {
            this.assignmentData = {
                subject: '',
                chapter: '',
                title: '',
                description: '',
                dueDate: '',
                maxMarks: '',
                questions: [
                    {
                        questionText: '',
                        questionType: 'multiple-choice',
                        marks: 1,
                        options: [
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false }
                        ],
                        correctAnswer: null
                    }
                ]
            }
        },

        async nextStep() {
            const { valid } = await this.$refs.assignmentBasicForm.validate()
            if (valid) {
                this.assignmentStep = 2
            }
        },

        previousStep() {
            this.assignmentStep = 1
        },

        addQuestion() {
            this.assignmentData.questions.push({
                questionText: '',
                questionType: 'multiple-choice',
                marks: 1,
                options: [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ],
                correctAnswer: null
            })
        },

        removeQuestion(index) {
            if (this.assignmentData.questions.length > 1) {
                this.assignmentData.questions.splice(index, 1)
            }
        },

        updateQuestionType(questionIndex) {
            const question = this.assignmentData.questions[questionIndex]
            
            if (question.questionType === 'multiple-choice') {
                question.options = [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ]
                question.correctAnswer = null
            } else if (question.questionType === 'true-false') {
                question.options = []
                question.correctAnswer = null
            } else {
                question.options = []
                question.correctAnswer = null
            }
        },

        addOption(questionIndex) {
            const question = this.assignmentData.questions[questionIndex]
            if (question.options.length < 5) {
                question.options.push({ text: '', isCorrect: false })
            }
        },

        removeOption(questionIndex, optionIndex) {
            const question = this.assignmentData.questions[questionIndex]
            if (question.options.length > 2) {
                question.options.splice(optionIndex, 1)
            }
        },

        setCorrectAnswer(questionIndex, optionIndex) {
            const question = this.assignmentData.questions[questionIndex]
            // For single correct answer, uncheck others
            question.options.forEach((option, index) => {
                if (index !== optionIndex) {
                    option.isCorrect = false
                }
            })
        },

        async createAssignment() {
            if (!this.canCreateAssignment) {
                this.showError('Please fill in all required fields')
                return
            }

            this.assignmentLoading = true

            try {
                const teacherId = this.currentUser?.id
                const classId = this.selectedClassInfo?.id

                if (!teacherId || !classId) {
                    throw new Error('Teacher ID or Class ID not found')
                }

                const response = await $fetch('/api/assignments', {
                    method: 'POST',
                    body: {
                        assignmentTitle: this.assignmentData.title,
                        subject: this.assignmentData.subject,
                        chapter: this.assignmentData.chapter,
                        description: this.assignmentData.description,
                        dueDate: this.assignmentData.dueDate,
                        maxMarks: this.assignmentData.maxMarks,
                        questions: this.assignmentData.questions,
                        classId: classId,
                        teacherId: teacherId
                    }
                })

                if (response.success) {
                    this.showSuccess('Assignment created successfully!')
                    this.cancelAssignment()
                    // Reload assignments to show the new one
                    this.loadAssignments()
                    console.log('✅ Assignment created:', response.assignment)
                } else {
                    this.showError('Failed to create assignment')
                }
            } catch (error) {
                console.error('❌ Error creating assignment:', error)
                this.showError('Failed to create assignment. Please try again.')
            } finally {
                this.assignmentLoading = false
            }
        },

        async updateAssignment() {
            console.log('🔥 UPDATE ASSIGNMENT METHOD CALLED!')
            console.log('🔍 Edit Mode:', this.isEditMode)
            console.log('🆔 Editing Assignment ID:', this.editingAssignmentId)
            
            if (!this.canCreateAssignment) {
                console.log('❌ Validation failed')
                this.showError('Please fill in all required fields')
                return
            }

            if (!this.editingAssignmentId) {
                console.log('❌ No assignment ID found')
                this.showError('Assignment ID not found')
                return
            }

            console.log('🎯 Starting UPDATE API call...')
            this.assignmentLoading = true

            try {
                const teacherId = this.currentUser?.id
                const classId = this.selectedClassInfo?.id

                console.log('👤 Teacher ID:', teacherId)
                console.log('🏫 Class ID:', classId)

                if (!teacherId || !classId) {
                    throw new Error('Teacher ID or Class ID not found')
                }

                // Calculate marks from questions
                const calculatedMarks = this.assignmentData.questions.reduce((total, question) => {
                    return total + (parseInt(question.marks) || 0)
                }, 0)

                const updatePayload = {
                    assignmentId: this.editingAssignmentId,
                    assignmentTitle: this.assignmentData.title,
                    subject: this.assignmentData.subject,
                    chapter: this.assignmentData.chapter,
                    description: this.assignmentData.description,
                    dueDate: this.assignmentData.dueDate,
                    maxMarks: this.assignmentData.maxMarks || calculatedMarks,
                    questions: this.assignmentData.questions,
                    classId: classId,
                    teacherId: teacherId
                }

                console.log('📦 Update Payload:', updatePayload)
                console.log('🚀 Making PUT request to /api/assignments')

                // Make the PUT request to update assignment
                const response = await $fetch('/api/assignments', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: updatePayload
                })

                console.log('📡 PUT Response received:', response)

                if (response && response.success) {
                    console.log('✅ UPDATE SUCCESS!')
                    this.showSuccess('Assignment updated successfully!')
                    
                    // Update the assignment in local array
                    const index = this.assignments.findIndex(a => a.id === this.editingAssignmentId)
                    if (index !== -1) {
                        // Update with response data
                        this.assignments[index] = {
                            ...this.assignments[index],
                            ...response.assignment,
                            id: this.editingAssignmentId // Ensure ID is preserved
                        }
                        console.log('✅ Local assignment updated at index:', index)
                        console.log('✅ Updated assignment data:', this.assignments[index])
                    } else {
                        console.log('⚠️ Assignment not found in local array, reloading...')
                        await this.loadAssignments()
                    }
                    
                    this.cancelAssignment()
                    console.log('🎉 Assignment update completed successfully!')
                } else {
                    console.error('❌ API returned unsuccessful response:', response)
                    this.showError(response?.message || 'Failed to update assignment')
                }
            } catch (error) {
                console.error('💥 CRITICAL ERROR in updateAssignment:', error)
                
                // Enhanced error handling
                let errorMessage = 'Failed to update assignment'
                
                if (error.statusCode === 400) {
                    errorMessage = error.statusMessage || 'Invalid assignment data provided'
                } else if (error.statusCode === 404) {
                    errorMessage = 'Assignment not found or you do not have permission to edit it'
                } else if (error.statusCode === 403) {
                    errorMessage = 'You do not have permission to edit this assignment'
                } else if (error.statusCode === 409) {
                    errorMessage = 'Assignment with this title already exists in the class'
                } else if (error.statusCode === 500) {
                    errorMessage = 'Server error while updating assignment'
                } else if (error.message) {
                    errorMessage = error.message
                }
                
                this.showError(errorMessage)
                
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    statusCode: error.statusCode,
                    statusMessage: error.statusMessage,
                    data: error.data
                })
            } finally {
                this.assignmentLoading = false
                console.log('🏁 Update assignment process finished')
            }
        },

        // Add explicit button handler to guarantee method call
        handleAssignmentSubmit() {
            console.log('🎯 BUTTON CLICKED - handleAssignmentSubmit')
            console.log('📝 Current mode:', this.isEditMode ? 'EDIT' : 'CREATE')
            
            if (this.isEditMode) {
                console.log('🔄 Calling UPDATE method...')
                this.updateAssignment()
            } else {
                console.log('➕ Calling CREATE method...')
                this.createAssignment()
            }
        },
        
        handleMenuClick(action) {
            console.log(`Menu clicked: ${action}`)
            // Handle different menu actions
            switch(action) {
                case 'profile':
                    // Handle profile action
                    break
                case 'settings':
                    // Handle settings action
                    break
                case 'reports':
                    // Handle reports action
                    break
            }
        },
        
        // Your original logout method is preserved
        logout() {
            // Clear session from localStorage
            if (process.client) {
                localStorage.removeItem('teacherSession')
            }
            
            // Redirect to login page
            this.$router.push('/TeacherLogin')
        },
        
        // Your original getCurrentUser method is preserved
        getCurrentUser() {
            if (process.client) {
                const session = localStorage.getItem('teacherSession')
                if (session) {
                    try {
                        const sessionData = JSON.parse(session)
                        return sessionData.user
                    } catch (error) {
                        return null
                    }
                }
            }
            return null
        }
    },
    mounted() {
        // Set drawer state based on screen size
        if (process.client) {
            this.drawer = this.$vuetify.display.lgAndUp
            
            // Wait for currentUser to be available, then load classes
            this.$nextTick(() => {
                // Small delay to ensure session is loaded
                setTimeout(() => {
                    if (this.currentUser?.id) {
                        console.log('User found, loading classes...')
                        this.loadClasses()
                    } else {
                        console.log('No user found yet, retrying...')
                        // Retry after a short delay
                        setTimeout(() => {
                            if (this.currentUser?.id) {
                                this.loadClasses()
                            } else {
                                console.error('Still no user found after retry')
                            }
                        }, 1000)
                    }
                }, 100)
            })
        }
    }
}
</script>

<style scoped>
/* Fixed Text Color Styles for Assignment Preview */

/* Header Text Colors */
.header-title {
  color: #ffffff !important;
}

.header-subtitle {
  color: #e3f2fd !important;
}

.badge-text {
  color: #1565c0 !important;
}

/* Assignment Info Text Colors */
.assignment-subject-text {
  color: #1565c0 !important;
}

.assignment-chapter-text {
  color: #424242 !important;
}

.instruction-text {
  color: #424242 !important;
}

.description-text-black {
  color: #37474f !important;
  line-height: 1.6;
}

/* Stats Card Text Colors */
.stat-number-green {
  color: #2e7d32 !important;
}

.stat-label-green {
  color: #388e3c !important;
}

.stat-number-orange {
  color: #ef6c00 !important;
}

.stat-label-orange {
  color: #f57c00 !important;
}

.stat-number-purple {
  color: #6a1b9a !important;
}

.stat-label-purple {
  color: #7b1fa2 !important;
}

/* Progress Section Text Colors */
.progress-title-text {
  color: #1565c0 !important;
}

.progress-percentage-text {
  color: #1565c0 !important;
}

/* Section Headers Text Colors */
.section-title-text {
  color: #1565c0 !important;
}

.question-count-text {
  color: #424242 !important;
}

/* Question Text Colors */
.question-text-black {
  color: #1565c0 !important;
  line-height: 1.6;
}

/* Answer Type Text Colors */
.chip-text-green {
  color: #2e7d32 !important;
}

.chip-text-orange {
  color: #f57c00 !important;
}

.chip-text-blue {
  color: #1976d2 !important;
}

.chip-text-purple {
  color: #7b1fa2 !important;
}

.answer-instruction-text {
  color: #424242 !important;
}

/* Option Text Colors */
.option-letter-text {
  color: #424242 !important;
}

.option-text-black {
  color: #424242 !important;
}

/* True/False Text Colors */
.tf-text-green {
  color: #4caf50 !important;
}

.tf-text-red {
  color: #f44336 !important;
}

/* Status Text Colors */
.status-text {
  color: #424242 !important;
}

/* Alert Text Colors */
.alert-title-text {
  color: #1976d2 !important;
}

.alert-description-text {
  color: #424242 !important;
}

/* Button Text Colors */
.btn-text-black {
  color: #424242 !important;
}

.footer-btn-text {
  color: #424242 !important;
}

/* No Questions Text Colors */
.no-questions-title {
  color: #616161 !important;
}

.no-questions-description {
  color: #757575 !important;
}

/* Enhanced Dialog Styling */
.preview-dialog-card {
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
}

/* Header Styling with Fixed Background */
.preview-header {
  background: linear-gradient(135deg, #6495ED 0%, #4169E1 20%, #1e3c72 100%) !important;
  position: relative;
  overflow: hidden;
}

.preview-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="20" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.preview-header-content {
  position: relative;
  z-index: 1;
}

.preview-icon {
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3) !important;
}

.preview-badge {
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9) !important;
}

/* Content Area */
.preview-content {
  background: linear-gradient(180deg, #fafbff 0%, #f5f7ff 100%);
  min-height: 100%;
}

.assignment-hero {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
  border-bottom: 1px solid rgba(100, 149, 237, 0.1);
}

/* Assignment Info Card */
.assignment-info-card {
  background: white !important;
  border: 1px solid rgba(100, 149, 237, 0.1);
  position: relative;
  overflow: hidden;
}

.assignment-info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #6495ED, #4169E1, #1e3c72);
}

.description-card {
  background: linear-gradient(135deg, #f8fffe 0%, #f0f9ff 100%) !important;
  border-left: 4px solid #6495ED;
}

/* Stats Cards */
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Progress Section */
.progress-card {
  border: 1px solid rgba(25, 118, 210, 0.2);
  position: relative;
  overflow: hidden;
}

.progress-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #1976d2, #2196f3);
}

.progress-bar {
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
  border-radius: 12px !important;
}

.progress-text {
  color: black !important;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 12px;
}

.progress-chip {
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

/* Section Headers */
.section-title-card {
  border: 1px solid rgba(100, 149, 237, 0.2);
}

.question-count-chip {
  box-shadow: 0 2px 8px rgba(100, 149, 237, 0.2);
}

/* Enhanced Question Cards */
.enhanced-question-card {
  border: 1px solid rgba(100, 149, 237, 0.15) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: white !important;
}

.enhanced-question-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #6495ED 0%, #4169E1 50%, #1e3c72 100%);
}

.enhanced-question-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(100, 149, 237, 0.25) !important;
  border-color: rgba(100, 149, 237, 0.3) !important;
}

.question-header-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f7ff 100%);
  padding: 20px 24px;
  border-bottom: 1px solid rgba(100, 149, 237, 0.1);
}

.question-number-badge {
  display: flex;
  align-items: center;
}

.question-chip {
  box-shadow: 0 4px 15px rgba(100, 149, 237, 0.3) !important;
  font-size: 14px !important;
}

.marks-chip {
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3) !important;
}

/* Question Text */
.question-text-card {
  border-left: 4px solid #6495ED !important;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%) !important;
}

/* Answer Section */
.answer-input-card {
  background: linear-gradient(135deg, #fafffe 0%, #f5f9ff 100%) !important;
  border: 1px solid rgba(100, 149, 237, 0.1) !important;
}

.answer-type-header {
  border-bottom: 1px solid rgba(100, 149, 237, 0.1);
  padding-bottom: 16px;
  margin-bottom: 20px !important;
}

/* Multiple Choice Options */
.enhanced-radio-group .option-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid rgba(100, 149, 237, 0.1) !important;
  background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%) !important;
}

.enhanced-radio-group .option-card:hover {
  border-color: rgba(100, 149, 237, 0.3) !important;
  transform: translateX(8px);
  box-shadow: 0 4px 20px rgba(100, 149, 237, 0.15);
}

.enhanced-radio-group .option-card.selected-option {
  border-color: #6495ED !important;
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%) !important;
  box-shadow: 0 6px 25px rgba(100, 149, 237, 0.25);
}

.option-radio {
  width: 100%;
}

.option-letter {
  min-width: 32px;
  justify-content: center;
}

/* True/False Options */
.tf-option-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid rgba(158, 158, 158, 0.2) !important;
  background: white !important;
  min-height: 120px;
  display: flex;
  align-items: center;
}

.tf-option-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.tf-option-card.selected-tf {
  border-color: #4caf50 !important;
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%) !important;
  box-shadow: 0 6px 25px rgba(76, 175, 80, 0.25);
}

.tf-option-card.selected-tf:last-child {
  border-color: #f44336 !important;
  background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%) !important;
  box-shadow: 0 6px 25px rgba(244, 67, 54, 0.25);
}

.tf-radio {
  width: 100%;
  justify-content: center;
}

/* Text Fields Enhancement */
.enhanced-text-field .v-field,
.enhanced-textarea .v-field {
  border-radius: 16px !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%) !important;
  border: 2px solid rgba(100, 149, 237, 0.1) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-text-field .v-field:hover,
.enhanced-textarea .v-field:hover {
  border-color: rgba(100, 149, 237, 0.3) !important;
  box-shadow: 0 4px 20px rgba(100, 149, 237, 0.15);
}

.enhanced-text-field .v-field--focused,
.enhanced-textarea .v-field--focused {
  border-color: #6495ED !important;
  box-shadow: 0 6px 25px rgba(100, 149, 237, 0.25);
}

/* Text Field Labels and Input Text */
.enhanced-text-field .v-field__input,
.enhanced-textarea .v-field__input {
  color: #424242 !important;
}

.enhanced-text-field .v-label,
.enhanced-textarea .v-label {
  color: #757575 !important;
}

.enhanced-text-field .v-field__placeholder,
.enhanced-textarea .v-field__placeholder {
  color: #9e9e9e !important;
}

/* Response Status */
.status-chip {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

/* Action Section */
.action-card {
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.preview-alert {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%) !important;
  border-left: 4px solid #2196f3;
}

.action-btn {
  min-width: 180px;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* No Questions State */
.no-questions-card {
  border: 2px dashed rgba(158, 158, 158, 0.3) !important;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%) !important;
}

/* Footer Actions */
.preview-footer {
  background: linear-gradient(135deg, #fafbff 0%, #f5f7ff 100%);
  border-top: 1px solid rgba(100, 149, 237, 0.1);
}

.footer-btn {
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.footer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Radio Group Label Text Color Fix */
.v-radio .v-label {
  color: #424242 !important;
}

/* Chip Text Color Fixes */
.v-chip .v-chip__content {
  color: inherit !important;
}

/* Card Title and Subtitle Text */
.v-card-title {
  color: #424242 !important;
}

.v-card-subtitle {
  color: #757575 !important;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.question-container {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.question-container:nth-child(1) { animation-delay: 0.1s; }
.question-container:nth-child(2) { animation-delay: 0.2s; }
.question-container:nth-child(3) { animation-delay: 0.3s; }
.question-container:nth-child(4) { animation-delay: 0.4s; }
.question-container:nth-child(5) { animation-delay: 0.5s; }

.assignment-info-card {
  animation: fadeInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.stat-card {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }

/* Responsive Design */
@media (max-width: 768px) {
  .preview-dialog-card {
    margin: 16px;
    max-width: calc(100vw - 32px) !important;
  }
  
  .preview-header-content {
    padding: 20px !important;
  }
  
  .question-header-section {
    padding: 16px 20px;
  }
  
  .enhanced-question-card {
    margin-bottom: 20px;
  }
  
  .action-btn {
    min-width: 140px;
    margin-bottom: 8px;
  }
  
  .question-number-badge {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .marks-chip {
    margin-left: 0 !important;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .assignment-hero {
    padding: 20px !important;
  }
  
  .questions-section {
    padding: 0 20px 20px !important;
  }
  
  .tf-option-card {
    min-height: 100px;
  }
  
  .action-btn {
    width: 100%;
    margin-bottom: 12px;
  }
}

/* Custom Scrollbar */
.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6495ED, #4169E1);
  border-radius: 10px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #4169E1, #1e3c72);
}

.custom-drawer {
  border-right: 1px solid #e0e0e0 !important;
}

.drawer-header {
  background: linear-gradient(135deg, #6495ED 0%, #4169E1 100%);
  color: white;
  margin-bottom: 0;
}

.drawer-header .v-list-item-title,
.drawer-header .v-list-item-subtitle {
  color: white !important;
}

.class-item {
  transition: all 0.3s ease;
}

/* Assignment cards styling */
.assignment-card {
  transition: all 0.3s ease;
  border-left: 4px solid #6495ED;
}

.assignment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(100, 149, 237, 0.2);
}

.assignment-header {
  flex: 1;
  min-width: 0; /* Allows text truncation */
}

.stat-item {
  text-align: center;
}

.assignment-stats {
  background-color: rgba(100, 149, 237, 0.05);
  border-radius: 8px;
  padding: 12px;
}

/* Assignment creation styling */
.questions-container {
  max-height: 400px;
  overflow-y: auto;
}

.question-card {
  border-left: 4px solid #6495ED;
}

.question-card .v-card {
  background-color: #fafafa;
}

/* Clickable card styling */
.clickable-card {
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.clickable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.card-arrow {
  position: absolute;
  top: 16px;
  right: 16px;
  transition: transform 0.3s ease;
}

.clickable-card:hover .card-arrow {
  transform: translateX(4px);
}

/* Assignment count card specific styling */
.assignment-count-card {
  cursor: pointer;
}

.assignment-count-card:hover {
  background-color: #e0f2e0 !important;
}

.class-list-item {
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.class-list-item:hover {
  background-color: rgba(100, 149, 237, 0.1);
}

.student-list-item {
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.student-list-item:hover {
  background-color: rgba(100, 149, 237, 0.05);
}

/* Delete button styling */
.delete-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.class-item:hover .delete-btn {
  opacity: 1;
}

.class-item:hover {
  background-color: rgba(100, 149, 237, 0.1) !important;
}

.selected-class {
  background-color: rgba(100, 149, 237, 0.15) !important;
  border-left: 4px solid #6495ED;
}

.menu-item {
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.custom-app-bar {
  background: linear-gradient(135deg, #6495ED 0%, #4169E1 100%) !important;
}

.custom-main {
  background-color: #fafafa;
}

/* Share dialog styling */
.qr-code-container {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Card hover effects */
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

/* Responsive adjustments */
@media (max-width: 960px) {
  .custom-drawer {
    z-index: 1001;
  }
}

@media (max-width: 600px) {
  .v-container {
    padding: 16px !important;
  }
}
</style>