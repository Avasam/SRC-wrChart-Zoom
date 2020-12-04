// Build code as string
var actualCode = '(' + function () {
  // Setup
  const zoomChart = (from, to) => {
    wrChart.data.datasets =
      originalDatasets.map(dataset =>
        ({
          ...dataset,
          data: dataset.data.filter(data =>
            data.x * 1000 >= from && data.x * 1000 <= to
          ),
        })
      )
    wrChart.update();
  }

  let fromInputElement;
  let toInputElement;
  const day1 = 86400000 - 1;
  window.onWrChartFromToChange = () =>
    zoomChart(
      new Date(fromInputElement.value).getTime(),
      new Date(toInputElement.value).getTime() + day1);

  const htmlToElement = (html) => {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
  }

  const zoomDateForm = htmlToElement(
    `<div>
      <label for="wrChart-from" style="width: 40px">From: </label>
      <input id="wrChart-from" onchange="onWrChartFromToChange()" type="date">
      <br />
      <label for="wrChart-to" style="width: 40px">To: </label>
      <input id="wrChart-to" onchange="onWrChartFromToChange()" type="date">
    </div>`
  );

  // Obtain the chart
  const wrChart = window.Chart.instances[0];
  const originalDatasets = wrChart.config.data.datasets;

  // Create elements in page
  document.getElementById('wrChart').parentNode.appendChild(zoomDateForm);
  fromInputElement = document.getElementById('wrChart-from');
  toInputElement = document.getElementById('wrChart-to');

  const allDateNumbers = originalDatasets.flatMap(datasets => datasets.data).map(data => data.x)
  fromInputElement.valueAsDate = new Date(Math.min(...allDateNumbers) * 1000);
  toInputElement.valueAsDate = new Date(Math.max(...allDateNumbers) * 1000);
} + ')();';

// Inject the code string into the page
// We have to do this to access Chart
const script = document.createElement('script');
script.textContent = actualCode;
(document.head || document.documentElement).appendChild(script);
script.remove();
