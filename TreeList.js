class TreeList {
  constructor(list_items = [], root_element_id = "tree-list", params = {}) {
    this.list_items = list_items.map(item => {
      item.name_without_space = item.name.replace(/\s/g, "_");
      return item;
    });

    this.root_element_id = root_element_id;

    this.items_stratify = d3.stratify()
      .id(item => params.hasOwnProperty("item_id") ? item[params.item_id] : item.name)
      .parentId(item => params.hasOwnProperty("item_parent") ? item[params.item_parent] : item.parent)
      (this.list_items);

    this.root_element = d3.select(`#${root_element_id}`)
    this.root_ul = this.root_element.append("ul")
      .classed("tree-list", true)
      .style("padding-inline-start", "25px")
      .style("list-style-type", "none")


    this.show_icon = "+";
    this.hide_icon = "-";
  }

  draw() {
    const self = this;

    function drawFolders(elem, struct) {
      var li = elem.append("li")

      li.append("span")
        .classed("list-item-name", true)
        .text(struct.data.name)

      if (!struct.hasOwnProperty("children")) {
        return li
      } else {
        var ul = li.append("ul")
          .attr("id", `${struct.data.name_without_space}-child`)
          .style("padding-inline-start", "25px")
          .style("list-style-type", "none")

        // добавляем иконку открытия/закрытия папки
        li.append("span").lower()
          .attr("list-item-name", struct.data.name_without_space)
          .style("padding-right", "8px")
          .style("cursor", "pointer")
          .text(self.hide_icon)
          .on("click", function () {
            var icon = self.hide_icon;
            var display = "";
            var interpolate = d3.interpolate(0, 1)

            var event_ul = d3.select("#" + this.getAttribute("list-item-name") + "-child")

            if (this.innerText === self.hide_icon) {
              icon = self.show_icon;
              display = "none";
              interpolate = d3.interpolate(1, 0);
            }

            event_ul
              .transition()
              .duration(1000)
              .styleTween("opacity", function () {
                return function (t) {
                  if (interpolate(t).toFixed(1) == 0.2) {
                    d3.select(this).style("display", display)
                  }
                  return interpolate(t)
                }
              })

            this.innerText = icon;
          })

        struct.children.forEach(child => {
          drawFolders(ul, child, child.hasOwnProperty("children") ? child.children : [])
        })
      }
    }

    drawFolders(this.root_ul, this.items_stratify)
  }

}