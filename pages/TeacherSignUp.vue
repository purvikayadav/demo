<template>
    <div class="registration-container">
        <v-container class="fill-height">
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card class="registration-card" elevation="8">
                        <v-card-title class="text-center pa-6">
                            <h2 class="text-h4 font-weight-bold registration-title">Registration</h2>
                        </v-card-title>

                        <v-card-text class="pa-6">
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <!-- Name Field -->
                                <v-text-field v-model="formData.name" :rules="nameRules" label="Full Name"
                                    prepend-inner-icon="mdi-account" variant="outlined" class="mb-3" required
                                    clearable></v-text-field>

                                <!-- Email Field -->
                                <!-- <v-text-field v-model="formData.email" :rules="emailRules" label="Email Address"
                                    prepend-inner-icon="mdi-email" variant="outlined" class="mb-3" type="email" required
                                    clearable></v-text-field> -->

                                <!-- Contact Number Field -->
                                <v-text-field v-model="formData.contactNo" :rules="contactRules" label="Contact Number"
                                    prepend-inner-icon="mdi-phone" variant="outlined" class="mb-3" type="tel" required
                                    clearable></v-text-field>

                                <!-- Password Field -->
                                <v-text-field
                                    v-model="formData.password"
                                    :rules="passwordRules"
                                    label="Password"
                                    prepend-inner-icon="mdi-lock"
                                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPassword ? 'text' : 'password'"
                                    variant="outlined"
                                    class="mb-3"
                                    required
                                    @click:append-inner="showPassword = !showPassword"
                                ></v-text-field>

                                <!-- Confirm Password Field -->
                                <v-text-field
                                    v-model="formData.confirmPassword"
                                    :rules="confirmPasswordRules"
                                    label="Confirm Password"
                                    prepend-inner-icon="mdi-lock-check"
                                    :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    variant="outlined"
                                    class="mb-4"
                                    required
                                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                                ></v-text-field>

                                <!-- Registration Button -->
                                <v-btn @click="handleRegistration" :disabled="!valid || loading" :loading="loading"
                                    color="#6495ED" size="large" variant="flat"
                                    class="w-100 registration-btn text-capitalize" elevation="2">
                                    {{ loading ? 'Registering...' : 'Register' }}
                                </v-btn>
                                <v-divider inset></v-divider>
                                <hr class="my-4">
                                <!-- <NuxtLink to="/login" class="text-decoration-none text-black d-flex justify-center">Already have an account?<span>  Login</span></NuxtLink> -->
                                <span class="d-flex justify-center">
                                    Already have an account?
                                    <NuxtLink to="/TeacherLogin" class="text-decoration-none login-link">
                                        Login
                                    </NuxtLink>
                                </span>

                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Success Snackbar -->
        <v-snackbar v-model="showSuccessMessage" color="success" timeout="3000" location="top">
            Registration successful! Welcome aboard.
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
    name: 'RegistrationForm',
    // Add navigation guard to block access after successful registration
    beforeRouteEnter(to, from, next) {
        // Check if user has successfully registered
        if (process.client && sessionStorage.getItem('registrationComplete')) {
            next('/TeacherLogin')
        } else {
            next()
        }
    },
    data() {
        return {
            valid: false,
            loading: false,
            showSuccessMessage: false,
            showErrorMessage: false,
            errorMessage: '',
            showPassword: false,
            showConfirmPassword: false,
            formData: {
                name: '',
                // email: '',
                contactNo: '',
                password: '',
                confirmPassword: ''
            },
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length >= 2) || 'Name must be at least 2 characters',
                v => (v && v.length <= 50) || 'Name must be less than 50 characters',
                v => /^[a-zA-Z\s]+$/.test(v) || 'Name can only contain letters and spaces'
            ],
            emailRules: [
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
            ],
            contactRules: [
                v => !!v || 'Contact number is required',
                v => /^[0-9+\-\s()]+$/.test(v) || 'Contact number must be valid',
                v => (v && v.replace(/\D/g, '').length >= 10) || 'Contact number must be at least 10 digits'
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8) || 'Password must be at least 8 characters',
                v => (v && v.length <= 50) || 'Password must be less than 50 characters',
                v => /(?=.*[a-z])/.test(v) || 'Password must contain at least one lowercase letter',
                v => /(?=.*[A-Z])/.test(v) || 'Password must contain at least one uppercase letter',
                v => /(?=.*\d)/.test(v) || 'Password must contain at least one number',
                v => /(?=.*[@$!%*?&])/.test(v) || 'Password must contain at least one special character (@$!%*?&)'
            ],
            confirmPasswordRules: [
                v => !!v || 'Please confirm your password',
                v => v === this.formData.password || 'Passwords do not match'
            ]
        }
    },
    methods: {
        // In your registration component
        async handleRegistration() {
            const { valid } = await this.$refs.form.validate()

            if (!valid) return

            this.loading = true

            try {
                // Remove confirmPassword from the data sent to API
                const { confirmPassword, ...registrationData } = this.formData
                
                const response = await $fetch('/api/register', {
                    method: 'POST',
                    body: registrationData
                })

                this.showSuccessMessage = true
                this.resetForm()
                
                // Mark registration as complete to block future access
                sessionStorage.setItem('registrationComplete', 'true')
                
                setTimeout(() => {
                    this.$router.push('/TeacherLogin')
                }, 1500)

            } catch (error) {
                this.showError('Registration failed. Please try again.')
            } finally {
                this.loading = false
            }
        },

        simulateApiCall() {
            // Simulate API delay - Replace with actual API call
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate success (90% success rate for demo)
                    if (Math.random() > 0.1) {
                        resolve({ success: true })
                    } else {
                        reject(new Error('API Error'))
                    }
                }, 2000)
            })
        },

        resetForm() {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.formData = {
                name: '',
                email: '',
                contactNo: '',
                password: '',
                confirmPassword: ''
            }
            this.showPassword = false
            this.showConfirmPassword = false
        },

        showError(message) {
            this.errorMessage = message
            this.showErrorMessage = true
        }
    }
}
</script>

<style scoped>
.login-link {
    color: black;
    text-decoration: none;
    margin-left: 4px;
    transition: color 0.3s, text-decoration 0.3s;
}

.login-link:hover {
    color: #6495ED;
    text-decoration: underline;
}

.registration-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #6495ED 0%, #4169E1 100%);
    padding: 20px 0;
}

.registration-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.registration-title {
    color: #6495ED;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.registration-btn {
    font-size: 1.1rem !important;
    letter-spacing: 0.5px;
    padding: 12px 24px !important;
    border-radius: 8px !important;
    transition: all 0.3s ease;
}

.registration-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(100, 149, 237, 0.4) !important;
}

.registration-btn:disabled {
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
    .registration-container {
        padding: 10px;
    }

    .registration-card {
        margin: 0 !important;
    }

    .registration-title {
        font-size: 1.75rem !important;
    }
}

@media (max-width: 400px) {
    .registration-title {
        font-size: 1.5rem !important;
    }

    .registration-btn {
        font-size: 1rem !important;
    }
}
</style>