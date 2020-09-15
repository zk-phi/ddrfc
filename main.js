function cmp (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

function sortByTitle (levels) {
    return levels.map(function (level) {
        return {
            level: level.level,
            charts: level.charts.sort(function (a, b) { return cmp(a.title, b.title); })
        };
    });
}

function sortByClear (levels) {
    const sv = { mfc: 0, pfc: 1, gfc: 2, fc: 3, ex: 4, clear: 5, fail: 6, noplay: 7 };
    return levels.map(function (level) {
        return {
            level: level.level,
            charts: level.charts.sort(function (a, b) { return cmp(sv[a.status], sv[b.status]); })
        };
    });
}

const vm = new Vue({
    el: "#app",
    data: {
        sort: "status",
        selected: null,
        levels: [],
        error: null
    },
    mounted: function () {
        var match = location.href.match(/\?(.+)$/);
        var xhr   = new XMLHttpRequest();
        xhr.onload = function () { vm.levels = sortByClear(JSON.parse(xhr.responseText)); };
        xhr.onerror = function () { vm.error = "Error loading chart list"; };
        xhr.open("GET", match ? match[1] : "levels.json", true);
        xhr.send(null);
    },
    computed: {
        summaries: function () {
            var summaries = {};
            vm.levels.forEach(function (level) {
                var count = { mfc: 0, pfc: 0, gfc: 0, fc: 0, ex: 0, clear: 0, fail: 0, noplay: 0 };
                var total = 0;
                level.charts.forEach(function (chart) {
                    count[chart.status]++;
                    total++;
                });
                summaries[level.level] = {
                    mfc: count.mfc * 100.0 / total,
                    pfc: count.pfc * 100.0 / total,
                    gfc: count.gfc * 100.0 / total,
                    fc: count.fc * 100.0 / total,
                    ex: count.ex * 100.0 / total,
                    clear: count.clear * 100.0 / total,
                    fail: count.fail * 100.0 / total,
                    noplay: count.noplay * 100.0 / total
                };
            });
            return summaries;
        }
    },
    watch: {
        sort: function () {
            vm.levels = (vm.sort == "title" ? sortByTitle : sortByClear)(vm.levels);
        }
    },
    methods: {
        select: function (level) {
            if (vm.selected == level) {
                vm.selected = null;
            } else {
                vm.selected = level;
            }
        }
    }
});
