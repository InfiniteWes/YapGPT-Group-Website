<template>
    <div class="deliverables-container">
        <div class="title-container">
            <h1>Deliverables</h1>
        </div>
        <div class="stages-container">
            <div class="stage-card">
                <h2>Stage 1</h2>
                <div class="stage-content">
                    <ul>
                        <li>Submit Report
                            <ul>
                                <li>Project description</li>
                                <li>Tasks with explanations</li>
                                <li>Interview log (multiple pages) and summary (half page)</li>
                                <li>SRS based on the IEEE Std 830-1998</li>
                            </ul>
                        </li>
                        <li>10-15 minute presentation slide</li>
                        <li>Building Webpage for group project</li>
                    </ul>
                </div>
            </div>
            <div class="stage-card">
                <h2>Stage 2</h2>
                <div class="details-stage-2">
                    <h3>To Be Added</h3>
                    <h3 class="dots"><span>.</span><span>.</span><span>.</span></h3>
                </div>
            </div>
            <div class="stage-card">
                <h2>Stage 3</h2>
                <div class="details-stage-3">
                    <h3>To Be Added</h3>
                    <h3 class="dots"><span>.</span><span>.</span><span>.</span></h3>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.deliverables-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.title-container {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 2rem;
    position: relative;
}

.title-container h1 {
    font-size: 2.5rem;
    color: #ffffff;
    position: relative;
    display: inline-block;
    padding-bottom: 10px;
}

.title-container h1:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 25%;
    width: 50%;
    height: 3px;
    background: linear-gradient(to right, transparent, #42b983, transparent);
}

.stages-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.stage-card {
    background-color: #2d2d2d;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stage-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.stage-card h2 {
    color: #42b983;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 10px;
    margin-bottom: 1rem;
    text-align: center;
}

.stage-content ul {
    margin-left: 0;
    padding-left: 1.2rem;
}

.stage-content li {
    margin-bottom: 0.5rem;
}

.details-stage-2, .details-stage-3 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.dots span {
    display: inline-block;
    opacity: 0;
    animation: dotFade 1.5s infinite;
}

.dots span:nth-child(2) {
    animation-delay: 0.5s;
}

.dots span:nth-child(3) {
    animation-delay: 1s;
}

@keyframes dotFade {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}

@media (max-width: 768px) {
    .stages-container {
        grid-template-columns: 1fr;
    }
}
</style>
