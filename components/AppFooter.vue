<template>
    <div class="footer">
        <UCard class="footer-card">
            <div class="flex flex-row justify-around text-primary">
                <div class="mx-4">Do not submit sensitive information. This system is for daily status only.</div>
                <div class="mx-4">All rights reserved 2025</div>
            </div>
        </UCard>
    </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.footer {
    width: 100%;
    text-align: center;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
    position: fixed;
    bottom: 0;
    z-index: 1000;
}
.footer-card {
    margin: 2rem;
    border-radius: 2rem;
}
</style>