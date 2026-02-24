

<template>
  <main class="flex-1 bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col border border-white">

    <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">

      <div class="mx-10 mt-8 flex items-center justify-between rounded-3xl bg-[#F6E6D9] p-20 overflow-hidden relative">
        <div class="z-10 max-w-sm">
          <h1 class="text-4xl font-bold text-indigo-950">Welcome all Kon Pandas to SlonHub.</h1>
          <p class="mt-4 text-gray-600">Jg ban ey rk merl tv, feel free to explore, search, and J'long</p>
        </div>

        <div class="absolute right-28 bottom-0 top-0 w-1/2 flex items-center justify-center">
          <img src="@/assets/hello.png" alt="Reading" class="h-65" />
        </div>
      </div>

      <div class="px-10 mt-12">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-indigo-950">Popular Now</h2>
          <button class="text-sm font-medium text-gray-400 hover:text-indigo-900">View All</button>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          <div v-for="book in books" :key="book.title" class="group cursor-pointer">
            <div
                :class="book.bgColor"
                class="aspect-[3/4] rounded-xl p-4 transition-transform duration-300 group-hover:-translate-y-2 flex flex-col justify-between shadow-sm"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider opacity-60">{{ book.author }}</span>
              <div class="text-2xl font-black leading-tight break-words uppercase" :class="book.textColor">
                {{ book.displayTitle }}
              </div>
            </div>

            <div class="mt-4">

              <h3 class="text-sm font-bold text-gray-800">{{ book.title }}</h3>

              <p class="text-xs text-gray-400">{{ book.author }}</p>

              <!--<div class="mt-1 flex text-[10px] text-yellow-400">
                ★★★★★
              </div>-->

            </div>
          </div>
        </div>
      </div>
    </div>
  </main>




</template>


<script setup lang="ts">

const books = [
  { title: 'Creative Hustle', displayTitle: 'Creative Hustle', author: 'Ramen Albert', bgColor: 'bg-[#F2E5D5]', textColor: 'text-indigo-900' },
  { title: 'Art Unleashed', displayTitle: 'Art For New Design', author: 'Stefano Milik', bgColor: 'bg-[#EBD9FC]', textColor: 'text-indigo-900' },
  { title: 'The Study of Brain', displayTitle: 'Your Strategy Study Brain', author: 'Alan W Watts', bgColor: 'bg-[#4B48A1]', textColor: 'text-white' },
  { title: '96', displayTitle: '96', author: 'Krimt Milan', bgColor: 'bg-[#F9E2F2]', textColor: 'text-indigo-900' },
  { title: 'Work for Money', displayTitle: 'Work For Money Design For Love', author: 'R Kelly', bgColor: 'bg-[#F3E6D9]', textColor: 'text-indigo-900' },
  { title: 'Brand Strategy', displayTitle: 'R', author: 'Dean Warner', bgColor: 'bg-[#4B48A1]', textColor: 'text-white' },
]


</script>

<style scoped>

</style>