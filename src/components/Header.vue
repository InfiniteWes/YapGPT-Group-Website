<template>
    <div>
        <nav>
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/OurProject" class="nav-link">Our Project</router-link>
            <router-link to="/TeamPage" class="nav-link">Team</router-link>
            <router-link to="/WorkTracker" class="nav-link">Work Tracker</router-link>
            <router-link to="/Deliverables" class="nav-link">Deliverables</router-link>
            <div id="indicator"></div>
        </nav>
    </div>
</template>

<style scoped>
/* --- container --- */
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: table;
  margin: 0 auto;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
}

/* --- router-link itself --- */
.nav-link {
  position: relative;
  width: 20%;
  top: 0;
  display: table-cell;
  text-align: center;
  color: #949494;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
  padding: 1rem 1.5rem;
  transition: 0.2s ease color;
}

/* active route styling (optional) */
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: #fff;
}

/* --- dots --- */
.nav-link::before,
.nav-link::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  transition: 0.2s ease transform;
}

.nav-link::before {
  top: 0;
  left: 10px;
  width: 6px;
  height: 6px;
}

.nav-link::after {
  top: 5px;
  left: 18px;
  width: 4px;
  height: 4px;
}

/* color sets */
.nav-link:nth-of-type(1)::before { background-color: yellow; }
.nav-link:nth-of-type(1)::after  { background-color: red; }

.nav-link:nth-of-type(2)::before { background-color: #00e2ff; }
.nav-link:nth-of-type(2)::after  { background-color: #89ff00; }

.nav-link:nth-of-type(3)::before { background-color: purple; }
.nav-link:nth-of-type(3)::after  { background-color: palevioletred; }

.nav-link:nth-of-type(4)::before { background-color: rgb(185, 0, 0); }
.nav-link:nth-of-type(4)::after  { background-color: rgb(104, 250, 255); }

.nav-link:nth-of-type(5)::before { background-color: rgb(0, 255, 0); }
.nav-link:nth-of-type(5)::after  { background-color: rgb(146, 36, 255); }

/* hover */
.nav-link:hover {
  color: #fff;
}
.nav-link:hover::before,
.nav-link:hover::after {
  transform: scale(1);
}

/* --- indicator --- */
#indicator {
  position: absolute;
  left: 5%;
  bottom: 0;
  width: 30px;
  height: 3px;
  background-color: #fff;
  border-radius: 5px;
  transition: 0.2s ease left;
}

/* indicator hover rules */
.nav-link:nth-of-type(1):hover ~ #indicator {
  left: 2%;
  background: linear-gradient(130deg, yellow, red);
}

.nav-link:nth-of-type(2):hover ~ #indicator {
  left: 22%;
  background: linear-gradient(130deg, #00e2ff, #89ff00);
}

.nav-link:nth-of-type(3):hover ~ #indicator {
  left: 42%;
  background: linear-gradient(130deg, purple, palevioletred);
}

.nav-link:nth-of-type(4):hover ~ #indicator {
  left: 62%;
  background: linear-gradient(130deg, rgb(185, 0, 0), rgb(104, 250, 255));
}

.nav-link:nth-of-type(5):hover ~ #indicator {
  left: 82%;
  background: linear-gradient(130deg, rgb(0, 255, 0), rgb(146, 36, 255));
}
</style>