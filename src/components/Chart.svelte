<script>
  import { onMount } from 'svelte';
  import { dataOne } from '../data/one/one'
  import { isDoubleBottom } from '../math/double-bottom'

  function createChart() {

    const options = {
      chart: {
        height: 1000,
        type: 'line',
      },
      series: [{
        data: dataOne
      }],
      title: {
        text: 'CandleStick Chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    }

    const chart = new ApexCharts(
      document.querySelector("#chart"),
      options
    );

    chart.render();
  }
  onMount(createChart);
  let dblBtm = isDoubleBottom(dataOne);
</script>

<div>
  <div class="absolute f2 avenir" style="left: 40%; top: 7%">Double Bottom: {dblBtm? 'Yes' : 'No'}</div>
  <div id="chart"></div>
</div>
