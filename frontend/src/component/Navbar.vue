<template>
  <header class="w-full bg-white px-8 py-4 flex flex-col gap-2 shadow-sm">


    <div class="flex items-center justify-between gap-8">
      <div class="text-xl font-bold text-[#2D2D2D] cursor-pointer">
        SlonHub
      </div>

      <div class="flex-1 max-w-2xl relative">
        <input
            type="text"
            placeholder="JG RK EY SEARCH NG TV...."
            class="w-full bg-[#F5F5F7] rounded-md py-2 px-4 pr-10 text-sm outline-none border border-transparent focus:border-gray-200 transition-all"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>

    </div>

    <nav class="flex justify-center items-center gap-8">
        <router-link to="/" class="nav-link" exact-active-class="nav-link-active">Home</router-link>
        <router-link to="/department" class="nav-link" active-class="nav-link-active">Department</router-link>
        <router-link to="/year" class="nav-link" active-class="nav-link-active">Year</router-link>
        <router-link to="/subject" class="nav-link" active-class="nav-link-active">Subject</router-link>
    </nav>

  </header>

</template>

<script setup>

</script>

<style scoped>
.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #6B7280;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #2D2D2D;
}

.nav-link-active {
  color: #2D2D2D;
  font-weight: 600;
  border-bottom: 2px solid #2D2D2D;
}
</style>
