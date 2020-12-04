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
      <div class="form-group row">
        <div class="col-2 col-md-1 text-right col-label-padding">
          <label for="wrChart-from">From: </label>
        </div>
        <div>
          <input id="wrChart-from" class="form-control" onchange="onWrChartFromToChange()" type="date">
        </div>
      </div>
      <div class="form-group row">
        <div class="col-2 col-md-1 text-right col-label-padding">
          <label for="wrChart-to">To: </label>
        </div>
        <div>
          <input id="wrChart-to" class="form-control" onchange="onWrChartFromToChange()" type="date">
        </div>
      </div>
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
