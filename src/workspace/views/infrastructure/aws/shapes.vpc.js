angular.module('designer.workspace.views.infrastructure.aws.shapes.vpc', ['designer.workspace.canvases.jointjs.shapes.container'])
  .service('VpcElement', ["ContainerElement", "ResourceImages", function(ContainerElement, ResourceImages) {
    var prebuilt_markup = V('<g>' +
      '<g class="scalable">' +
      '<rect class="vpc mainRect"/>' +
      '</g>' +
      '<g class="control-bar">' +
      '<image width="24px" height="24px" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTYgMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPiAgICAgICAgPHRpdGxlPkltcG9ydGVkIExheWVyczwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZGVmcz48L2RlZnM+ICAgIDxnIGlkPSI4LUNvcHktQ29weSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+ICAgICAgICA8ZyBpZD0iMS0tLW1haW4iIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05MzguMDAwMDAwLCAtMjIxLjAwMDAwMCkiIHN0cm9rZT0iI0I4QjhCOCIgc3Ryb2tlLXdpZHRoPSIxLjUiPiAgICAgICAgICAgIDxnIGlkPSJJbXBvcnRlZC1MYXllcnMtMi0rLUltcG9ydGVkLUxheWVycyIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTM5LjAwMDAwMCwgMjIyLjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNS4yLDQuMzQ0MjE2MjIgQzUuMiwzLjYxOTY3NTY4IDYuMDE0NCwzLjAwNzEzNTE0IDcuMDI4NTcxNDMsMy4wMDcxMzUxNCBDOC4wNDI3NDI4NiwzLjAwNzEzNTE0IDguODU3MTQyODYsMy42MTk2NzU2OCA4Ljg1NzE0Mjg2LDQuMzQ0MjE2MjIgTDguODU3MTQyODYsNS41MTM1MTM1MSBMNS4yLDUuNTEzNTEzNTEgTDUuMiw0LjM0NDIxNjIyIEw1LjIsNC4zNDQyMTYyMiBaIE0xMi4zMzkyLDUuNTEzNTEzNTEgTDExLjY1NzE0MjksNS41MTM1MTM1MSBMMTEuNjU3MTQyOSwzLjk3ODgxMDgxIEMxMS42NTcxNDI5LDEuNzgxMTg5MTkgOS42ODM4ODU3MSwwIDcuMDI4NTcxNDMsMCBDNC4zNzMyNTcxNCwwIDIuNCwxLjc4MTE4OTE5IDIuNCwzLjk3ODgxMDgxIEwyLjQsNS41MTM1MTM1MSBMMS43MTc5NDI4Niw1LjUxMzUxMzUxIEMwLjc1NjM0Mjg1Nyw1LjUxMzUxMzUxIDAsNi4yNjQ0MzI0MyAwLDcuMTM0MjcwMjcgTDAsMTMuOTk0MTYyMiBDMCwxNC44NjMxMzUxIDAuNzU2MzQyODU3LDE1LjU2NzU2NzYgMS43MTc5NDI4NiwxNS41Njc1Njc2IEwxMi4zMzgyODU3LDE1LjU2NzU2NzYgQzEzLjMwMDgsMTUuNTY3NTY3NiAxNC4wNTcxNDI5LDE0Ljg2MzEzNTEgMTQuMDU3MTQyOSwxMy45OTQxNjIyIEwxNC4wNTcxNDI5LDcuMTM0MjcwMjcgQzE0LjA1NzE0MjksNi4yNjQ0MzI0MyAxMy4zMDA4LDUuNTEzNTEzNTEgMTIuMzM5Miw1LjUxMzUxMzUxIEwxMi4zMzkyLDUuNTEzNTEzNTEgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==" class="lockstyle"/>' +
      '<image width="24px" height="24px" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMjNweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMjMgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPiAgICAgICAgPHRpdGxlPkltcG9ydGVkIExheWVycyAyPC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IjgtQ29weS1Db3B5IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4gICAgICAgIDxnIGlkPSIxLS0tbWFpbiIgc2tldGNoOnR5cGU9Ik1TQXJ0Ym9hcmRHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTk2Mi4wMDAwMDAsIC0yMjIuMDAwMDAwKSIgc3Ryb2tlPSIjQjhCOEI4IiBzdHJva2Utd2lkdGg9IjIuNSI+ICAgICAgICAgICAgPGcgaWQ9IkltcG9ydGVkLUxheWVycy0yLSstSW1wb3J0ZWQtTGF5ZXJzIiBza2V0Y2g6dHlwZT0iTVNMYXllckdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5MzkuMDAwMDAwLCAyMjIuMDAwMDAwKSI+ICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNy4wNTIyMjMxLDUuMjg5MDI2MTkgQzM3LjQ2MjIwNzUsNC45OTQ5OTUwMiAzNy45NTg0ODk3LDQuODIwNTc5NzQgMzguNDkzMzEyNyw0LjgyMDU3OTc0IEMzOS44NzcxNDk4LDQuODIwNTc5NzQgNDAuOTk1NjY5OSw1Ljk2NzUzNyA0MS4wNDE3NTEzLDcuNDA0OTg5OTkgQzQzLjAyNDM2NjcsNy41NzkxMTA2NiA0NC41NjgyMzE3LDkuNTk2NjcxMjQgNDQuNTY4MjMxNywxMS4yMDAyOTAxIEw0NC41NjgyMzE3LDExLjU0OTEyMDcgQzQ0LjU2ODIzMTcsMTMuMjcyOTQ0NyA0Mi43ODYxNCwxNS4wMjA2MzMgNDAuNTg2MjQ0MSwxNS4wMjA2MzMgTDI4Ljg2OTU3MSwxNS4wMjA2MzMgQzI2LjY3Mzg2NDIsMTUuMDIwNjMzIDI0Ljg5MTc3MjYsMTMuMjcyOTQ0NyAyNC44OTE3NzI2LDExLjU0OTEyMDcgTDI0Ljg5MTc3MjYsMTEuMjAwMjkwMSBDMjQuODkxNzcyNiw5Ljg3MTI1NzQ3IDI1Ljk0OTQwOTUsOC4wNDQ2MTA5MSAyNy40NDAyMTExLDcuNTkxNzc5MzQgQzI3LjQ0MDIxMTEsNy41NDQwNTA4MyAyNy40MzMyMjkxLDcuNDkyMTk3NjQgMjcuNDMzMjI5MSw3LjQ0MTIyODMxIEMyNy40MzMyMjkxLDQuNTMwNjczMjUgMjkuNjg1MzUwNiwyLjE3NTc3MjMgMzIuNDY0MTk1OSwyLjE3NTc3MjMgQzM0LjUwNzQxNTIsMi4xNzU3NzIzIDM2LjI2MzgxMywzLjQ1NDQyNDg5IDM3LjA1MjIyMzEsNS4yODkwMjYxOSBaIiBpZD0iSW1wb3J0ZWQtTGF5ZXJzLTIiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4gICAgICAgICAgICA8L2c+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=" class="routetable"/>' +
      '</g>' +
      '<g class="control-bar">' +
      '<circle class="sg-control" ' +
      'onmouseover="evt.target.parentElement.parentElement.getElementsByClassName(\'lockstyle\')[0].setAttribute(\'opacity\', \'0.5\')" ' +
      'onmouseout="evt.target.parentElement.parentElement.getElementsByClassName(\'lockstyle\')[0].setAttribute(\'opacity\', \'1\')" />' +
      '<circle class="rt-control" ' +
      'onmouseover="evt.target.parentElement.parentElement.getElementsByClassName(\'routetable\')[0].setAttribute(\'opacity\', \'0.5\')" ' +
      'onmouseout="evt.target.parentElement.parentElement.getElementsByClassName(\'routetable\')[0].setAttribute(\'opacity\', \'1\')" />' +
      '</g>' +
      '<text class="description1"/>' +
      '<text class="title"/>' +
      '</g>');

    return ContainerElement.extend({
      prebuilt_markup: prebuilt_markup,
      defaults: joint.util.defaultsDeep({
        shape: "aws.vpc",
        size: { width: 600, height: 600 },
        z: 10,
        attrs: {
          '.title': { fill: '#979797', ref: '.vpc', y: -10 },
          '.description1': { fill: '#979797', ref: '.vpc', 'font-size': 11, y: -25 },
          // If I set refs to 1 or 0 it ignores them - basically I'm setting the position to the top right of 'rect', and then using cx and cy to add padding
          '.control-bar': { width: 20, height: 20, x: -100, y: 10, ref: '.vpc', 'ref-x': 0.999999, 'ref-y': 0.00001, opacity: 2 },
          '.lockstyle': { fill: "#6A6A6A", stroke: "#222222", x: -40, y: 10 },
          '.routetable': { fill: "#6A6A6A", stroke: "#222222", x: -70, y: 10 },
          '.sg-control': { r: 12, control: "sg", cx: -28, cy: 22, cursor: "pointer", 'fill-opacity': 0 },
          '.rt-control': { r: 12, control: "rt", cx: -58, cy: 22, cursor: "pointer", 'fill-opacity': 0 },
          '.mainRect': { stroke: '#B8B8B8', "stroke-width": 1, width: 600, height: 600, 'fill-opacity': 0, rx: 5, ry: 5 }
        }
      }, ContainerElement.prototype.defaults),

      updateContainerText: function(paper) {
        var resource = this.get("resource");

        this.attr(".title/text", (resource.name || ""));
        this.attr(".description1/text", (resource.cidr_block || ""));
      },

      updateTheme: function() {
        var resource = this.get("resource");
        resource.setImageUrl();

        var style = ResourceImages.getStyle("aws", this.attributes.shape); // VpcElement
        this.attr(".mainRect", style);
        this.attr(".title/fill", style["stroke"]);
        this.attr(".description1/fill", style["stroke"]);
      }
    });
  }]);
