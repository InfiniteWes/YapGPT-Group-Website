<template>
    <div class="Team-container">
        <div class="grid1">
            <h1 class="name-titles">Alyssa Calvillo</h1>
            <div>
                <p>Role: Team Member</p>
                <p>Major: Computer Science</p>
            </div>
        </div>
        <div class="grid2">
            <h1 class="name-titles">Deepa Kale</h1>
            <div>
                <p>Role: Team Member</p>
                <p>Major: Computer Science</p>
            </div>
        </div>
        <div class="grid3">
            <h1 class="name-titles">Wesley Spangler</h1>
            <div>
                <p>Role: Team Leader</p>
                <p>Major: Computer Science</p>
            </div>
        </div>
        <div class="grid4">
            <h1 class="name-titles">William Paar</h1>
            <div>
                <p>Role: Team Member</p>
                <p>Major: Computer Science</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

.Team-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr; 
    grid-template-rows: 1fr; 
    grid-gap: 1.5rem;
    justify-content: space-between;
    padding: 1rem;
}

.grid1 {
    background-image: linear-gradient(to bottom right, #00c6ff, #0072ff);
    border-radius: 8px;
    width: 100%;
    height: 100%;
}

.grid1:hover {
    transform: scale(1.05);
}

.grid2 {
    background-image: linear-gradient(to bottom right, #ff7e5f, #feb47b);
    border-radius: 8px;
}

.grid2:hover {
    transform: scale(1.05);
}

.grid3 {
    background-image: linear-gradient(to bottom right, #6a11cb, #2575fc);
    border-radius: 8px;
}

.grid3:hover {
    transform: scale(1.05);
}

.grid4 {
    background-image: linear-gradient(to bottom right, #ff6a00, #ee0979);
    border-radius: 8px;
}

.grid4:hover {
    transform: scale(1.05);
}

.name-titles {
    font-size: 2rem;
}

</style>