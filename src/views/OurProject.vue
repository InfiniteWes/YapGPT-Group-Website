<template>
    <div class="project-page">
        <div class="container">
            <h1 class="project-title">Our Project</h1>
            <div class="project-content">
                <div class="project-description">
                    <h2 class="section-title">Network Traffic Analysis & TCP Protocol Monitoring</h2>
                    <p class="description-text">
                        In this project, we are required to analyze large network traffic data to detect communications that do
                        not follow the handshaking mechanism of the TCP protocol. In particular, we need to identify all of the
                        potential issues found in the log data and develop solutions that can be potentially used for future predictions of suspicious
                        communications.
                    </p>
                    
                    <div class="project-objectives">
                        <h3 class="objectives-title">Project Objectives</h3>
                        <ul class="objectives-list">
                            <li>Analyze large-scale network traffic datasets</li>
                            <li>Identify TCP protocol handshaking irregularities</li>
                            <li>Detect suspicious communication patterns</li>
                            <li>Develop predictive models for future threat detection</li>
                            <li>Document and categorize potential security issues</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.project-page {
    min-height: 100vh;
    padding-top: 80px;
    color: #ffffff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.project-title {
    font-size: 3rem;
    padding: 1rem;
    font-weight: bold;
    text-align: center;
    background-color: #ffffff;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.project-content {
    border-radius: 15px;
    padding: 2.5rem;
    backdrop-filter: blur(10px);
    margin-bottom: 2rem;
}

.section-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #00e2ff;
}

.description-text {
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    color: #e0e0e0;
    text-align: justify;
}

.project-objectives {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding: 2rem;
    border-left: 4px solid #00ffff;
}

.objectives-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #00ffff;
}

.objectives-list {
    list-style: disc;
    padding: 0;
}

.objectives-list li {
    font-size: 1.1rem;
    padding: 0.5rem 0;
    color: #d0d0d0;
    position: relative;
    padding-left: 2rem;
}

.objectives-list li::before {
    position: absolute;
    left: 0;
    color: #f66b00;
    font-weight: bold;
}

.objectives-list li:hover {
    color: #ffffff;
    transform: translateX(5px);
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .project-title {
        font-size: 2rem;
    }
    
    .project-content {
        padding: 1.5rem;
    }
    
    .section-title {
        font-size: 1.5rem;
    }
    
    .description-text {
        font-size: 1rem;
    }
}
</style>