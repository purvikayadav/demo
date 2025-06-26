<template>
    <div class="login-container">
        <v-container class="fill-height">
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card class="login-card" elevation="8">
                        <v-card-title class="text-center pa-6">
                            <h2 class="text-h4 font-weight-bold login-title">Teacher Login</h2>
                        </v-card-title>

                        <v-card-text class="pa-6">
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <!-- Contact Number Field -->
                                <v-text-field v-model="loginData.contactNo" :rules="contactRules" label="Contact Number"
                                    prepend-inner-icon="mdi-phone" variant="outlined" class="mb-3" type="tel" required
                                    clearable></v-text-field>

                                <!-- Password Field -->
                                <v-text-field v-model="loginData.password" :rules="passwordRules" label="Password"
                                    prepend-inner-icon="mdi-lock"
                                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPassword ? 'text' : 'password'" variant="outlined" class="mb-4" required
                                    @click:append-inner="showPassword = !showPassword"
                                    @keyup.enter="handleLogin"></v-text-field>

                                <!-- Forgot Password Link -->
                                <div class="text-right mb-4">
                                    <NuxtLink to="/forgot-password" class="text-decoration-none forgot-password-link">
                                        Forgot Password?
                                    </NuxtLink>
                                </div>

                                <!-- Login Button -->
                                <v-btn @click="handleLogin" :disabled="!valid || loading" :loading="loading"
                                    color="#6495ED" size="large" variant="flat" class="w-100 login-btn text-capitalize"
                                    elevation="2">
                                    {{ loading ? 'Logging in...' : 'Login' }}
                                </v-btn>

                                <v-divider inset></v-divider>
                                <hr class="my-4">

                                <!-- Register Link -->
                                <span class="d-flex justify-center">
                                    Don't have an account?
                                    <NuxtLink to="/TeacherSignUp" class="text-decoration-none register-link">
                                        Register
                                    </NuxtLink>
                                </span>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Success Snackbar -->
        <v-snackbar v-model="showSuccessMessage" color="success" timeout="2000" location="top">
            Login successful! Redirecting to dashboard...
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="showSuccessMessage = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

        <!-- Error Snackbar -->
        <v-snackbar v-model="showErrorMessage" color="error" timeout="4000" location="top">
            {{ errorMessage }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="showErrorMessage = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
definePageMeta({
    middleware: 'guest'
})
export default {
    name: 'TeacherLogin',
    data() {
        return {
            valid: false,
            loading: false,
            showSuccessMessage: false,
            showErrorMessage: false,
            errorMessage: '',
            showPassword: false,
            loginData: {
                contactNo: '',
                password: ''
            },
            contactRules: [
                v => !!v || 'Contact number is required',
                v => /^[0-9+\-\s()]+$/.test(v) || 'Contact number must be valid',
                v => (v && v.replace(/\D/g, '').length >= 10) || 'Contact number must be at least 10 digits'
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8) || 'Password must be at least 8 characters'
            ]
        }
    },
    methods: {
        async handleLogin() {
            const { valid } = await this.$refs.form.validate()

            if (!valid) {
                this.showError('Please fill in all required fields correctly.')
                return
            }

            this.loading = true

            try {
                // FIXED: Use correct login API endpoint
                const response = await $fetch('/api/login', {
                    method: 'POST',
                    body: this.loginData
                })

                if (response.success) {
                    // Store user session in localStorage
                    const sessionData = {
                        user: response.user,
                        token: response.token,
                        loginTime: new Date().toISOString(),
                        isLoggedIn: true
                    }

                    localStorage.setItem('teacherSession', JSON.stringify(sessionData))

                    this.showSuccessMessage = true

                    // Redirect to teacher dashboard after short delay
                    setTimeout(() => {
                        this.$router.push('/TeacherDashboard')
                    }, 1500)
                } else {
                    this.showError('Invalid contact number or password.')
                }

            } catch (error) {
                console.error('Login error:', error)
                this.showError('Login failed. Please check your credentials and try again.')
            } finally {
                this.loading = false
            }
        },

        resetForm() {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.loginData = {
                contactNo: '',
                password: ''
            }
            this.showPassword = false
        },

        showError(message) {
            this.errorMessage = message
            this.showErrorMessage = true
        },

        // Check if user is already logged in
        checkExistingSession() {
            const session = localStorage.getItem('teacherSession')
            if (session) {
                try {
                    const sessionData = JSON.parse(session)
                    if (sessionData.isLoggedIn) {
                        // User is already logged in, redirect to dashboard
                        this.$router.push('/TeacherDashboard')
                    }
                } catch (error) {
                    // Invalid session data, clear it
                    localStorage.removeItem('teacherSession')
                }
            }
        }
    },
    mounted() {
        // Check for existing session first
        this.checkExistingSession()

        // Auto-focus on contact number field when component mounts
        this.$nextTick(() => {
            const contactField = this.$refs.form?.$el?.querySelector('input[type="tel"]')
            if (contactField) {
                contactField.focus()
            }
        })
    }
}
</script>

<style scoped>
.register-link {
    color: black;
    text-decoration: none;
    margin-left: 4px;
    transition: color 0.3s, text-decoration 0.3s;
}

.register-link:hover {
    color: #6495ED;
    text-decoration: underline;
}

.forgot-password-link {
    color: #6495ED;
    font-size: 0.875rem;
    transition: color 0.3s, text-decoration 0.3s;
}

.forgot-password-link:hover {
    color: #4169E1;
    text-decoration: underline;
}

.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #6495ED 0%, #4169E1 100%);
    padding: 20px 0;
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-title {
    color: #6495ED;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-btn {
    font-size: 1.1rem !important;
    letter-spacing: 0.5px;
    padding: 12px 24px !important;
    border-radius: 8px !important;
    transition: all 0.3s ease;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(100, 149, 237, 0.4) !important;
}

.login-btn:disabled {
    transform: none !important;
}

/* Input field focus styles */
:deep(.v-field--focused) {
    box-shadow: 0 0 0 2px rgba(100, 149, 237, 0.2);
}

:deep(.v-field--focused .v-field__outline) {
    border-color: #6495ED !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .login-container {
        padding: 10px;
    }

    .login-card {
        margin: 0 !important;
    }

    .login-title {
        font-size: 1.75rem !important;
    }
}

@media (max-width: 400px) {
    .login-title {
        font-size: 1.5rem !important;
    }

    .login-btn {
        font-size: 1rem !important;
    }
}
</style>