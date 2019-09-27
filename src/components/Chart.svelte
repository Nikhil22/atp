<script>
  import { onMount } from 'svelte';
  import { dataOne } from '../data'
  import { isDoubleBottom, buildClosesData } from '../math'

  function createChart() {

    const options = {
      chart: {
        height: 1000,
        type: 'candlestick',
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
  let dblBtm = isDoubleBottom(buildClosesData(dataOne), 9);
</script>

<div>
  <div class="absolute f2 avenir" style="left: 40%; top: 7%">Double Bottom: {dblBtm? 'Yes' : 'No'}</div>
  <div id="chart"></div>
</div>
