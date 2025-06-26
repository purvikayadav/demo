<template>
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
        <v-list-subheader class="text-uppercase font-weight-bold text-grey-darken-1">
          Classes
        </v-list-subheader>

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
            <v-chip
              size="small"
              :color="selectedClass === classItem.id ? '#6495ED' : 'grey-lighten-2'"
              variant="flat"
            >
              {{ classItem.studentCount }}
            </v-chip>
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
          <div class="text-caption opacity-75">{{ currentUser?.contactNo || '' }}</div>
        </div>
        <v-avatar size="40" color="white">
          <v-icon color="#6495ED">mdi-account</v-icon>
        </v-avatar>
      </div>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="custom-main">
      <v-container fluid class="pa-6">
        <!-- Dynamic Component Based on Selected Class -->
        <component 
          :is="selectedComponent" 
          :selectedClass="selectedClass"
          :classInfo="selectedClassInfo"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// Import all class components
import Class8Component from '~/components/Class8Component.vue'
import Class10Component from '~/components/Class10Component.vue'
import Class12Component from '~/components/Class12Component.vue'
import DefaultDashboard from '~/components/DefaultDashboard.vue'

export default {
  name: 'DefaultLayout',
  components: {
    Class8Component,
    Class10Component,
    Class12Component,
    DefaultDashboard
  },
  data() {
    return {
      drawer: true,
      selectedClass: 'default', // Default to overview
      classes: [
        {
          id: 'class8',
          name: 'Class 8',
          icon: 'mdi-numeric-8-box',
          studentCount: 45,
          component: 'Class8Component'
        },
        {
          id: 'class10', 
          name: 'Class 10',
          icon: 'mdi-numeric-10-box',
          studentCount: 38,
          component: 'Class10Component'
        },
        {
          id: 'class12',
          name: 'Class 12', 
          icon: 'mdi-numeric-12-box',
          studentCount: 42,
          component: 'Class12Component'
        }
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
            return sessionData.user
          } catch (error) {
            return null
          }
        }
      }
      return null
    },
    selectedClassInfo() {
      return this.classes.find(c => c.id === this.selectedClass)
    },
    selectedComponent() {
      // Return the component name based on selected class
      const classInfo = this.selectedClassInfo
      return classInfo ? classInfo.component : 'DefaultDashboard'
    }
  },
  methods: {
    selectClass(classId) {
      this.selectedClass = classId
      console.log(`Selected class: ${classId}`)
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
    
    logout() {
      // Clear session from localStorage
      if (process.client) {
        localStorage.removeItem('teacherSession')
      }
      
      // Redirect to login page
      this.$router.push('/TeacherLogin')
    }
  },
  mounted() {
    // Set drawer state based on screen size
    if (process.client) {
      this.drawer = this.$vuetify.display.lgAndUp
    }
  }
}
</script>

<style scoped>
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