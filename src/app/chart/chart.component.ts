import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chart from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SHOMockDataService } from '../services/sho-data.service.mock';

export const colors = [
  {
    backgroundColor: '#269CD4',
    borderColor: '#269CD4',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#EB5064',
    borderColor: '#EB5064',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#44F2D1',
    borderColor: '#44F2D1',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#B7D639',
    borderColor: '#B7D639',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FDDA02',
    borderColor: '#FDDA02',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FFA173',
    borderColor: '#FFA173',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#BA5FA4',
    borderColor: '#BA5FA4',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#A286E6',
    borderColor: '#A286E6',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#687FCF',
    borderColor: '#687FCF',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#A8323E',
    borderColor: '#A8323E',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FC4903',
    borderColor: '#FC4903',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#03FC1C',
    borderColor: '#03FC1C',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#03BEFC',
    borderColor: '#03BEFC',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#C603FC',
    borderColor: '#C603FC',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FC036B',
    borderColor: '#FC036B',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FCF803',
    borderColor: '#FCF803',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
];


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  shos: any[] = [];
  participant: any = {};
  chart: any;
  chartData: any;
  wallet = '0x02c22dad3e10b51a8c23bb7160c5179545280733';
  @ViewChild('mylinechart')
  private chartComponent: any;
  scrolY = 0;
  percent = 0;
  amboxj = 0;
  position = 0;
  maxValueFromLastDay: number = 0;
  dataSets: any;

  constructor(private shoDataService: SHOMockDataService) {
    this.chart = this.initChart();
    this.shos = shoDataService.getUserSHOs(this.wallet);
    this.participant = shoDataService.getParticipant(this.wallet);
    this.dataSets = this.createDatasets();
    this.chart.dataSets = this.dataSets;
    let maxVesting = 0;
    console.log('CHART DEFAULTs');
    console.log(Chart.defaults);

    for (let i = 0; i < this.dataSets.length; i++) {
      const dataset = this.dataSets[i];
      if (dataset.data.length) {
        maxVesting += dataset.data[dataset.data.length - 1];
      }
    }
    let num = 1;
    for (
      let i = 0;
      i < parseInt(maxVesting.toString()).toString().length - 2;
      i++
    ) {
      num *= 10;
    }
    this.maxValueFromLastDay =
      num * 2 +
      parseInt(maxVesting.toString()) -
      ((num * 2 + parseInt(maxVesting.toString())) % num);
    this.chart.options.scales.yAxes[0].ticks.max = this.maxValueFromLastDay;
  }

  // initChart() {
  //   return {
  //     chartType: 'line',
  //     labels: this.initLabels(),
  //     dataSets: [],
  //     plugins: {
  //       tooltip: {
  //         enabled: false,
  //         intersect: false,
  //       },
  //     },
  //     options: {
  //       elements: {
  //         point: {
  //           radius: 0,
  //         },
  //         line: {
  //           tension: 0,
  //         },
  //       },
  //       responsive: true,
  //       tooltips: {
  //         enabled: false,
  //         mode: 'nearest',
  //         intersect: false,
  //         custom: (tooltipModel: any) => {
  //           let description = [];
  //           const data = this.chart.dataSets;
  //           if (tooltipModel.title) {
  //             this.scrolY = 0;
  //             this.percent = 0;
  //             this.amboxj = 0;
  //             for (let i = 0; i < data.length; i++) {
  //               const dataset = data[i];
  //               console.log(dataset);
  //               if (dataset.hidden) continue;
  //               if (dataset.data.length) {
  //                 this.position = parseInt(tooltipModel.title[0]);
  //                 description.push(
  //                   dataset.label + ' $' + parseInt(dataset.data[this.position])
  //                 );
  //                 this.scrolY += dataset.data[this.position];
  //               }
  //             }
  //           }
  //           this.percent =
  //             ((this.maxValueFromLastDay - this.scrolY) /
  //               this.maxValueFromLastDay) *
  //             100;
  //           var tooltipEl = document.getElementById('chartjs-tooltip');

  //           if (!tooltipEl) {
  //             tooltipEl = document.createElement('div');
  //             tooltipEl.id = 'chartjs-tooltip';
  //             tooltipEl.innerHTML = '<div class="tolltipeTable"></div>';
  //             document
  //               .getElementsByClassName('chart-wrapper-canvas')[0]
  //               .appendChild(tooltipEl);
  //           }

  //           const posit = this.position > 182 ? 'right' : 'left';
  //           const rotate = this.position > 182 ? 45 : 225;
  //           var innerHtml = '<div class="chart-pointer">';

  //           innerHtml +=
  //             '<div class="chart-pointer-arrow" style="' +
  //             posit +
  //             ': 26px; transform: rotate(' +
  //             rotate +
  //             'deg);"></div>';
  //           innerHtml +=
  //             '<div class="chart-pointer-text" style="' +
  //             posit +
  //             ': 34px; top: -' +
  //             (description.length * 11 + 30) +
  //             'px">';

  //           innerHtml += '<p>' + this.position + '</p>';
  //           innerHtml +=
  //             '<p class="chart-total-vested">' +
  //             'Total vested USD value : 38,000' +
  //             '</p>';
  //           description.forEach(function (body: any, i: any) {
  //             innerHtml += '<p class="chart-percent-value" >' + body + '</p>';
  //           });

  //           innerHtml += '</div>' + '</div>';

  //           var tableRoot = tooltipEl.querySelector('.tolltipeTable');
  //           if (tableRoot) {
  //             tableRoot.innerHTML = innerHtml;
  //           }

  //           // `this` will be the overall tooltip
  //           var bounding =
  //             this.chartComponent.nativeElement.getBoundingClientRect();

  //           // Display, position, and set styles for font
  //           const chartHeight = document.getElementsByClassName(
  //             'chart-wrapper-canvas'
  //           )[0].clientHeight;
  //           const laspercent =
  //             ((chartHeight - chartHeight / 7.5) * this.percent) / 100 + 'px';

  //           tooltipEl.style.opacity = '1';
  //           tooltipEl.style.position = 'absolute';
  //           tooltipEl.style.left =
  //             bounding.left +
  //             window.pageXOffset +
  //             tooltipModel.caretX -
  //             20 +
  //             'px';
  //           tooltipEl.style.top = laspercent;
  //         },
  //       },

  //       maintainAspectRatio: false,
  //       bezierCurve: false,
  //       legend: {
  //         display: true,
  //         position: 'bottom',
  //         onClick: (e: any, legendItem: any) => {},
  //       },
  //       scales: {
  //         xAxes: [
  //           {
  //             display: true,
  //             stacked: true,
  //           },
  //         ],
  //         yAxes: [
  //           {
  //             display: true,
  //             stacked: true,
  //             ticks: {
  //               beginAtZero: true,
  //               max: 0,
  //             },
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'Number of Reads',
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     colors,
  //   };
  // }
  @ViewChild(BaseChartDirective, { static: true }) chart2: BaseChartDirective | null = null;


  initChart() {
    return {
      chartType: 'line',
      labels: this.initLabels(),
      dataSets: [],
      plugins: {
        tooltip: {
          enabled: false,
          intersect: false,
        },
      },
      options: {
        elements: {
          point: {
            radius: 0,
          },
          line: {
            tension: 0,
          },
        },
        onClick: (event: any) => {
          var yTop = this.chart2?.chart.chartArea.top;
          var yBottom = this.chart2?.chart.chartArea.bottom;

          var yMin = this.chart2?.chart.options.scales['y-axis-0'].min;
          var yMax = this.chart2?.chart.options.scales['y-axis-0'].max;
          var newY = 0;

          if (event.offsetY <= yBottom && event.offsetY >= yTop) {
              newY = Math.abs((event.offsetY - yTop) / (yBottom - yTop));
              newY = (newY - 1) * -1;
              newY = newY * (Math.abs(yMax - yMin)) + yMin;
          };

          var xTop = this.chart2.chart.chartArea.left;
          var xBottom =this.chart2.chart.chartArea.right;
          var xMin =this.chart2.chart.options.scales['x-axis-0'].min;
          var xMax = this.chart2.chart.options.scales['x-axis-0'].max;
          var newX = 0;

          if (event.offsetX <= xBottom && event.offsetX >= xTop) {
              newX = Math.abs((event.offsetX - xTop) / (xBottom - xTop));
              newX = newX * (Math.abs(xMax - xMin)) + xMin;
          };

          console.log(newX, newY);
      },
        onHover: (chart: Chart, event: MouseEvent, activeElements: Array<{}>) => {
          console.log(chart);
          console.log(event);
          console.log(activeElements);
        },
        responsive: true,
        tooltips: {
          enabled: false,
          mode: 'nearest',
          intersect: false,
          custom: (tooltipModel: any) => {
            console.log('CUSTOm');

            let description = [];
            const data = this.chart.dataSets;
            if (tooltipModel.title) {
              this.scrolY = 0;
              this.percent = 0;
              this.amboxj = 0;
              for (let i = 0; i < data.length; i++) {
                const dataset = data[i];
                console.log(dataset);
                if (dataset.hidden) continue;
                if (dataset.data.length) {
                  this.position = parseInt(tooltipModel.title[0]);
                  description.push(
                    dataset.label + ' $' + parseInt(dataset.data[this.position])
                  );
                  this.scrolY += dataset.data[this.position];
                }
              }
            }
            this.percent =
              ((this.maxValueFromLastDay - this.scrolY) /
                this.maxValueFromLastDay) *
              100;
            var tooltipEl = document.getElementById('chartjs-tooltip');

            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<div class="tolltipeTable"></div>';
              document
                .getElementsByClassName('chart-wrapper-canvas')[0]
                .appendChild(tooltipEl);
            }

            const posit = this.position > 182 ? 'right' : 'left';
            const rotate = this.position > 182 ? 45 : 225;
            var innerHtml = '<div class="chart-pointer">';

            innerHtml +=
              '<div class="chart-pointer-arrow" style="' +
              posit +
              ': 26px; transform: rotate(' +
              rotate +
              'deg);"></div>';
            innerHtml +=
              '<div class="chart-pointer-text" style="' +
              posit +
              ': 34px; top: -' +
              (description.length * 11 + 30) +
              'px">';

            innerHtml += '<p>' + this.position + '</p>';
            innerHtml +=
              '<p class="chart-total-vested">' +
              'Total vested USD value : 38,000' +
              '</p>';
            description.forEach(function (body: any, i: any) {
              innerHtml += '<p class="chart-percent-value" >' + body + '</p>';
            });

            innerHtml += '</div>' + '</div>';

            var tableRoot = tooltipEl.querySelector('.tolltipeTable');
            if (tableRoot) {
              tableRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
            var bounding =
              this.chartComponent.nativeElement.getBoundingClientRect();

            // Display, position, and set styles for font
            const chartHeight = document.getElementsByClassName(
              'chart-wrapper-canvas'
            )[0].clientHeight;
            const laspercent =
              ((chartHeight - chartHeight / 7.5) * this.percent) / 100 + 'px';

            tooltipEl.style.opacity = '1';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left =
              bounding.left +
              window.pageXOffset +
              tooltipModel.caretX -
              20 +
              'px';
            tooltipEl.style.top = laspercent;
          },
        },
        maintainAspectRatio: false,
        bezierCurve: false,
        legend: {
          display: true,
          position: 'bottom',
          onClick: (e: any, legendItem: any) => {},
        },
        scales: {
          xAxes: [
            {
              display: true,
              stacked: true,
              ticks: {
                beginAtZero: true,
                autoSkipPadding: 61, // MAGIC
                autoSkip: true,
                maxRotation: 0,
                callback(value: any) {
                  return value + 'd';
                },
              },
              scaleLabel: {
                display: true,
                labelString: 'Days',
              },
            },
          ],
          yAxes: [
            {
              display: true,
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Estimated total USD value with current prices',
              },
            },
          ],
        },
      },
      colors,
    };
  }

  initLabels() {
    return ['0d', '30d', '60d', '90d', '120d', '150d', '180d', '210d', '240d'];
  }

  createDatasets() {
    if (!this.shos || !this.participant) {
      return [];
    }
    const datasets: any = [];
    this.shos.forEach((sho) => {
      datasets.push(this.createShoDataset(sho, this.participant));
    });

    return datasets;
  }

  createShoDataset(sho: any, participant: any) {
    const amount = this.shoDataService.getShoVestingAmount(sho, participant);
    const period = this.shoDataService.getShoVestingPeriod(sho);

    this.chart.labels = period;
    const label = sho.is_listed ? sho.name : sho.name + ' (unlisted)';
    return {
      data: amount,
      label,
      period,
    };
  }
  ngOnInit(): void {}
}
