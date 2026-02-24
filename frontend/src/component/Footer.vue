<script setup lang="ts">

</script>

<template>
  <footer class="w-full bg-[#2D2D2D] text-white mt-auto">
    <div class="max-w-7xl mx-auto px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- About Section -->
        <div>
          <h3 class="text-xl font-bold mb-4">SlonHub</h3>
          <p class="text-gray-300 text-sm">
            SlonHub is your go-to platform for accessing a wide range of educational resources (only in ITC and specially for GIC family)
            Explore my extensive collection of books, notes, and guides across various subjects and departments.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </router-link>
            </li>
            <li>
              <router-link to="/department" class="text-gray-300 hover:text-white transition-colors text-sm">
                Department
              </router-link>
            </li>
            <li>
              <router-link to="/year" class="text-gray-300 hover:text-white transition-colors text-sm">
                Year
              </router-link>
            </li>
            <li>
              <router-link to="/subject" class="text-gray-300 hover:text-white transition-colors text-sm">
                Subject
              </router-link>
            </li>
          </ul>
        </div>

        <!-- About -->
        <div>
          <h4 class="text-lg font-semibold mb-4">About</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/aboutmjaspage" class="text-gray-300 hover:text-white transition-colors text-sm">
                About MJAS Page
              </router-link>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-600 mt-8 pt-6 text-center">
        <p class="text-gray-400 text-sm">
          &copy; {{ new Date().getFullYear() }} SlonHub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>

</style>

