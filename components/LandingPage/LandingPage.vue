<template>
    <!-- <h1>First Page</h1> -->
    <div class="container">
        <div class="d-flex justify-space-evenly align-center text-black text-h5 font-weight-bold mt-5 nav-section">
            <div class="nav-item">Home</div>
            <div class="nav-item">
                <NuxtLink to="/TeacherSignUp" class="text-decoration-none text-black">Teacher</NuxtLink>
            </div>
            <div class="nav-item">Student</div>
        </div>
        <div class="d-flex justify-space-evenly mt-10 hero-section" style="height: 300px">
            <div class="mt-15 hero-content">
                <p class="pt-15 text-h4 font-weight-bold hero-text" style="color: white">
                    Fueling Education Through Digital Innovation.
                </p>
            </div>
        </div>
    </div>
    <!-- <div class="mt-15" id="teacher">
        <h1 class="d-flex justify-center ">Welcome Teacher</h1>
        <div class="d-flex justify-center">
            <v-btn  class="d-flex mt-10 text-capitalize text-h6" varient="outlined">Register & Continue</v-btn>
        </div>
    </div>
    <div class="mt-15" id="teacher">
        <h1 class="d-flex justify-center ">Welcome Student</h1>
        <div class="d-flex justify-center">
            <v-btn  class="d-flex mt-10 text-capitalize text-h6" varient="outlined">Register & Continue</v-btn>
        </div>
    </div> -->
</template>


<script>
definePageMeta({
  middleware: 'guest'
})
</script>

<style scoped>

.container {
    height: 400px;
    background-color: #6495ED;
}

.v-btn:hover {
    /* border-color: #6495ED !important; */
    box-shadow: 0 4px 12px rgba(100, 149, 237, 0.4);
    border: 1px solid #6495ED !important;
}

/* Responsive Styles */

/* Navigation responsiveness */
.nav-section {
    padding: 0 16px;
}

.nav-item {
    text-align: center;
    flex-shrink: 0;
}

/* Hero section responsiveness */
.hero-section {
    padding: 0 16px;
    align-items: center !important;
}

.hero-content {
    width: 100%;
    text-align: center;
    padding: 0 16px;
}

.hero-text {
    line-height: 1.2;
    word-wrap: break-word;
}

/* Large screens (1200px and up) */
@media (min-width: 1200px) {
    .container {
        height: 400px;
    }
    
    .hero-text {
        font-size: 2.125rem !important;
    }
}

/* Medium screens (960px to 1199px) */
@media (max-width: 1199px) and (min-width: 960px) {
    .container {
        height: 380px;
    }
    
    .hero-text {
        font-size: 1.875rem !important;
    }
}

/* Small tablets (768px to 959px) */
@media (max-width: 959px) and (min-width: 768px) {
    .container {
        height: 350px;
    }
    
    .nav-section {
        padding: 0 12px;
    }
    
    .hero-text {
        font-size: 1.625rem !important;
        padding: 0 24px;
    }
    
    .hero-section {
        height: 250px !important;
    }
}

/* Mobile landscape (600px to 767px) */
@media (max-width: 767px) and (min-width: 600px) {
    .container {
        height: 320px;
    }
    
    .nav-section {
        padding: 0 8px;
        font-size: 1.125rem !important;
    }
    
    .hero-text {
        font-size: 1.375rem !important;
        padding: 0 16px;
    }
    
    .hero-section {
        height: 220px !important;
        margin-top: 2rem !important;
    }
    
    .hero-content {
        margin-top: 1rem !important;
    }
}

/* Mobile portrait (480px to 599px) */
@media (max-width: 599px) and (min-width: 480px) {
    .container {
        height: 300px;
    }
    
    .nav-section {
        padding: 0 8px;
        font-size: 1rem !important;
        margin-top: 1rem !important;
    }
    
    .hero-text {
        font-size: 1.25rem !important;
        padding: 0 12px;
        line-height: 1.3;
    }
    
    .hero-section {
        height: 200px !important;
        margin-top: 1.5rem !important;
    }
    
    .hero-content {
        margin-top: 0.5rem !important;
    }
}

/* Small mobile (320px to 479px) */
@media (max-width: 479px) {
    .container {
        height: 280px;
        padding: 0 8px;
    }
    
    .nav-section {
        padding: 0 4px;
        font-size: 0.875rem !important;
        margin-top: 0.5rem !important;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .nav-item {
        min-width: 60px;
        padding: 4px 8px;
    }
    
    .hero-text {
        font-size: 1.125rem !important;
        padding: 0 8px;
        line-height: 1.4;
    }
    
    .hero-section {
        height: 180px !important;
        margin-top: 1rem !important;
    }
    
    .hero-content {
        margin-top: 0 !important;
        padding: 0 8px;
    }
}

/* Extra small mobile (below 320px) */
@media (max-width: 319px) {
    .container {
        height: 260px;
        padding: 0 4px;
    }
    
    .nav-section {
        padding: 0 2px;
        font-size: 0.75rem !important;
        margin-top: 0.25rem !important;
        flex-direction: column;
        gap: 4px;
        align-items: center;
    }
    
    .nav-item {
        width: 100%;
        text-align: center;
        padding: 2px 4px;
    }
    
    .hero-text {
        font-size: 1rem !important;
        padding: 0 4px;
        line-height: 1.5;
    }
    
    .hero-section {
        height: 160px !important;
        margin-top: 0.5rem !important;
    }
    
    .hero-content {
        margin-top: 0 !important;
        padding: 0 4px;
    }
}
</style>