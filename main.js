const vm = new Vue({
    el: "#app",
    data: {
        selected: null,
        levels: [],
        error: null
    },
    mounted: function () {
        var match = location.href.match(/\?(.+)$/);
        var xhr   = new XMLHttpRequest();
        xhr.onload = function () { vm.levels = JSON.parse(xhr.responseText); };
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
