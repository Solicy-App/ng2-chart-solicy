import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
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
  wallet = '0x005e1ecfafe45d0887428b8f6c5db978ec72296a';
  @ViewChild('mylinechart')
  private chartComponent: any;
  scrolY = 0;
  percent = 0;
  amboxj = 0;
  position = 0;
  constructor(private shoDataService: SHOMockDataService) {
    this.chart = this.initChart();
    this.shos = shoDataService.getUserSHOs(this.wallet);
    this.participant = shoDataService.getParticipant(this.wallet);
    this.chart.dataSets = this.createDatasets();
  }

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
        responsive: true,
        tooltips: {
          enabled: false,
          mode: 'nearest',
          intersect: false,
          custom: (tooltipModel: any) => {
            let description = [];
            const data = this.createDatasets();
            if (tooltipModel.title) {
              this.scrolY = 0;
              this.percent = 0;
              this.amboxj = 0;
              console.log(
                document.getElementsByClassName('chartjs-render-monitor')
              );
              for (let i = 0; i < data.length; i++) {
                if (data[i].data.length) {
                  this.position = parseInt(tooltipModel.title[0]);
                  description.push(
                    data[i].label + ' $' + parseInt(data[i].data[this.position])
                  );
                  this.scrolY += data[i].data[this.position];
                }
              }
            }
            this.percent = (70000 - this.scrolY) / 700;
            console.log(
              '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
              this.scrolY,
              '------------start',
              this.percent
            );
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', document.getElementsByClassName('chart-wrapper-canvas')[0].clientHeight);

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
            var innerHtml =
              '<div style=" width: 15px; border-radius: 50%; position: relative; height: 15px; background: linear-gradient(90deg, #4086ff 0%, #2bcdff 100%); border: 6px solid #ffffff; box-shadow: 0px 3px 10px rgb(0 0 0 / 10%);">';

            innerHtml +=
              '<div style="position: absolute; width: 210px; ' +
              posit +
              ': 24px; background: #ffffff; border: 1px solid #1fa5ff; box-sizing: border-box; box-shadow: 0px 0px 4px rgb(0 0 0 / 10%), 0px 4px 8px rgb(0 0 0 / 10%); border-radius: 10px;">';

            innerHtml += '<p>' + this.position + '</p>';

            description.forEach(function (body: any, i: any) {
              innerHtml +=
                '<p style="font-size: 10px; line-height: 12px; margin-left: 20px; color: #727c9a;">' +
                body +
                '</p>';
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
            console.log("end>>>>>>>>>>>>>>>>", this.percent)
            tooltipEl.style.opacity = '1';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left =
              bounding.left +
              window.pageXOffset +
              tooltipModel.caretX -
              20 +
              'px';
            tooltipEl.style.top = this.percent - 3 + '%';
          },
        },

        maintainAspectRatio: false,
        bezierCurve: false,
        legend: {
          display: true,
          position: 'bottom',
        },
        scales: {
          xAxes: [
            {
              display: true,
              stacked: true,
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
                labelString: 'Number of Reads',
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
