<div class="standings">
    <table>
        <caption>
            Final standings at the race track
        </caption>
        <thead>
            <tr>
                <th>Name</th>
                <th># Wins</th>
                <th># Losses</th>
            </tr>
        </thead>
        <tbody>
            {{#each raceEntries}}
            <tr>
                <td>
                    {{#get racer data='name'}}{{/get}}
                </td>
                <td>
                    {{#get racer data='wins'}}{{/get}}
                </td>
                <td>
                    {{#get racer data='losses'}}{{/get}}
                </td>
            </tr>
            {{/each}}
        </tbody>
        <tfoot>
            <td colspan="3" class="notification"></td>
        </tfoot>
    </table>
</div>