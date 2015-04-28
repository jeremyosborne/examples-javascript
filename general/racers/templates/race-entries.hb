{{#each raceEntries}}
<div class="race-entry">
    <div class="race-car" style="margin-left:{{distanceTraveled}}px; background-color:{{#get racer data='carColor'}}{{/get}};">
        <div class="wheel-rear"></div>
        <div class="driver-number">{{#get racer data='number'}}{{/get}}</div>
        <div class="wheel-fore"></div>
    </div>
</div>
{{/each}}
