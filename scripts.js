const ProductInventoryTable = document.getElementById("ProductInventory");
const ProductEntryTable = document.getElementById("ProductEntry");
const ProductOutTable = document.getElementById("ProductOut");
const ProductInventoryInput = document.getElementById("ProductInventoryInput");
const ProductEntryInput = document.getElementById("ProductEntryInput");
const ProductOutInput = document.getElementById("ProductOutInput");
const ProductInventoryTitle = document.getElementById("ProductInventoryTitle");
const ProductEntryTitle = document.getElementById("ProductEntryTitle");
const ProductOutTitle = document.getElementById("ProductOutTitle");
const AnalyticsTitle = document.getElementById("AnalyticsTitle");
const Analytics = document.getElementById("Analytics");

var ActiveTable = ProductInventoryTable;
var inventoryItems = [];
var entryItems = [];
var outItems = [];
var totalValuePI = 0;
var chartDataPI = [];
var chartDataEntry = [];
var chartDataOut = [];

//#region Funções para selecionar qual tabela exibir.

const showTable = (table) => {
  deselectTables();
  document.getElementById(table).style.display = "inline-table";
  document.getElementById(table + "Title").style.fontWeight = "800";
  document.getElementById(table + "Input").style.display = "flex";
  ActiveTable = document.getElementById(table);
  populateCode();
};

const showAnalytics = () => {
  deselectTables();
  AnalyticsTitle.style.fontWeight = "800"
  Analytics.style.display = "block";  
  loadAnalyticsData();
};

const deselectTables = () => {
  ProductInventoryTable.style.display = "none";
  ProductEntryTable.style.display = "none";
  ProductOutTable.style.display = "none";
  ProductInventoryTitle.style.fontWeight = "normal";
  ProductEntryTitle.style.fontWeight = "normal";
  ProductOutTitle.style.fontWeight = "normal";
  ProductInventoryInput.style.display = "none";
  ProductEntryInput.style.display = "none";
  ProductOutInput.style.display = "none";
  AnalyticsTitle.style.fontWeight = "normal";
  Analytics.style.display = "none";
};

//#endregion

//#region Funções para obter a lista de estoque de produtos, de entrada e de saída do servidor via requisição GET

const getInventoryList = async () => {
  let url = "http://127.0.0.1:5000/produtos";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      inventoryItems = data.produtos;
      inventoryItems.forEach(item => addToInventoryList(item.codigo, item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getEntriesList = async () => {
  let url = "http://127.0.0.1:5000/entradas";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      entryItems = data.entradas;
      entryItems.forEach(item => addToEntryList(item.id, item.codigo, item.quantidade, item.data))
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getOutsList = async () => {
  let url = "http://127.0.0.1:5000/saidas";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      outItems = data.saidas;
      outItems.forEach(item => addToOutList(item.id, item.codigo, item.quantidade, item.cliente, item.valor, item.data))
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

//#endregion  

//#region Funções para colocar um item na lista (Estoque, Entrada ou Saída) do servidor via requisição POST

const postItemInventory = async (code, name, quantity, value) => {
  const formData = new FormData();
  formData.append("codigo", code);
  formData.append("nome", name);
  formData.append("quantidade", quantity);
  formData.append("valor", value);

  let url = "http://127.0.0.1:5000/produto";
  fetch(url, {
    method: "post",
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

const postItemEntry = async (code, quantity, date) => {
  const formData = new FormData();
  formData.append("codigo", code);
  formData.append("quantidade", quantity);
  formData.append("data", date);

  let url = "http://127.0.0.1:5000/entrada";
  fetch(url, {
    method: "post",
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

const postItemOut = async (code, quantity, client, value, date) => {
  const formData = new FormData();
  formData.append("codigo", code);
  formData.append("quantidade", quantity);
  formData.append("cliente", client);
  formData.append("value", value);  
  formData.append("data", date);

  let url = "http://127.0.0.1:5000/saida";
  fetch(url, {
    method: "post",
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

//#endregion

//#region Função para editar um item na lista Estoque do servidor via requisição PUT
// executada automaticamente toda vez que há uma alteração nas tabelas de entrada ou saída

const putItemInventory = async (code, name, quantity, value) => {
  const formData = new FormData();
  formData.append("codigo", code);
  formData.append("nome", name);
  formData.append("quantidade", quantity);
  formData.append("valor", value);

  let url = "http://127.0.0.1:5000/produto/" + code;
  fetch(url, {
    method: "put",
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

//#endregion 

//#region Funções para deletar um item das listas (Estoque, Entrada e Saída) do servidor via requisição DELETE

const deleteItemFromInventory = (code) => {
  let url = "http://127.0.0.1:5000/produto?codigo=" + code;
  fetch(url, {
    method: "delete"
  })
    .then((response) => {
      alert("Produto removido.");
    })
    .catch((error) => {
      alert("Erro ao remover produto.");
      console.error("Error:", error);
    });
};

const deleteItemFromEntry = (id) => {
  let url = "http://127.0.0.1:5000/entrada?id=" + id;
  fetch(url, {
    method: "delete"
  })
    .then((response) => {
      alert("Entrada removida.")
    })
    .catch((error) => {
      alert("Erro ao remover entrada.");
      console.error("Error:", error);
    });
};

const deleteItemFromOut = (id) => {
  let url = "http://127.0.0.1:5000/saida?id=" + id;
  fetch(url, {
    method: "delete"
  })
    .then((response) => [
      alert("Saída Removida.")
    ])
    .catch((error) => {
      console.error("Error:", error);
    });
};

//#endregion

//#region Funções para remover um item da lista/tabela de acordo com o click no botão close

ProductInventoryTable.onclick = function (e) {
  var target = e.target;
  if (target.className == "removeBtn") {
    var row = target.parentNode.parentNode;
    deleteItemFromInventory(row.children[0].textContent);
    inventoryItems.splice(inventoryItems.findIndex(item => item.codigo === row.children[0].textContent));
    ActiveTable.deleteRow(row.rowIndex);
  }
};

ProductEntryTable.onclick = function (e) {
  var target = e.target;
  if (target.className == "removeBtn") {
    var row = target.parentNode.parentNode;
    deleteItemFromEntry(row.children[0].textContent);
    updateInventory(row.children[1].textContent, row.children[2].textContent * -1);
    ProductEntryTable.deleteRow(row.rowIndex);
  }
};

ProductOutTable.onclick = function (e) {
  var target = e.target;
  if (target.className == "removeBtn") {
    var row = target.parentNode.parentNode;
    deleteItemFromOut(row.children[0].textContent);
    updateInventory(row.children[1].textContent, row.children[2].textContent);
    ProductOutTable.deleteRow(row.rowIndex);
  }
};

//#endregion

//#region Função para criar um botão delete para cada item das listas

const insertRemoveButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "removeBtn";
  span.appendChild(txt);
  parent.appendChild(span);
}

//#endregion

//#region Funções para adicionar um novo item ao estoque, entrada ou saída, com base no input do html.

const addToInventory = () => {
  let inputCode = document.getElementById("newCode").value;
  let inputName = document.getElementById("newName").value;
  let inputQty = document.getElementById("newQty").value;
  let inputValue = document.getElementById("newValue").value;
  if (inputCode === "") {
    alert("Escreva o código do produto!");
  } else if (isNaN(inputQty) || isNaN(inputValue) || inputQty == "" || inputValue == "") {
    alert("Quantidade e valor precisam ser números!");
  } else {
    addToInventoryList(inputCode, inputName, inputQty, inputValue)
    postItemInventory(inputCode, inputName, inputQty, inputValue)
    var obj = {
      codigo: inputCode,
      nome: inputName,
      quantidade: inputQty * 1,
      valor: inputValue * 1
    };
    inventoryItems.push(obj);
    alert("Produto adicionado ao estoque!")
  }
};

const addToEntries = () => {
  let inputCode = document.getElementById("newCodeIn").value;
  let inputQty = document.getElementById("newQtyIn").value;
  let inputDate = document.getElementById("newDateIn").value;
  if (inputCode === "") {
    alert("Escreva o código do produto!");
  } else if (isNaN(inputQty) || inputQty == "") {
    alert("Quantidade precisa ser número!");
  } else if (inputDate === "") {
    alert("Preencha o campo data!");
  }
  else {
    if (inventoryItems.map(item => item.codigo).indexOf(inputCode) != -1) {
      postItemEntry(inputCode, inputQty, inputDate);
      var id = document.getElementById("ProductEntry").rows.length;
      addToEntryList(id, inputCode, inputQty, inputDate);
      updateInventory(inputCode, inputQty);
      alert("Entrada do produto registrada!");
    }
    else {
      alert("Produto não existe. Cadastre no estoque primeiro.");
    }
  }
};

const addToOuts = () => {
  let inputCode = document.getElementById("newCodeOut").value;
  let inputQty = document.getElementById("newQtyOut").value;
  let inputClient = document.getElementById("newClientOut").value;
  let inputValue = document.getElementById("newValueOut").value;
  let inputDate = document.getElementById("newDateOut").value;
  if (inputCode === "") {
    alert("Escreva o código do produto!");
  } else if (isNaN(inputQty) || isNaN(inputValue)) {
    alert("Quantidade e valor precisam ser números!");
  } else if (inputDate === "") {
    alert("Preencha o campo data!");
  }
  else {
    postItemOut(inputCode, inputQty, inputClient, inputValue, inputDate);
    var id = document.getElementById("ProductOut").rows.length;
    addToOutList(id, inputCode, inputQty, inputClient, inputValue, inputDate);
    updateInventory(inputCode, -inputQty);
    alert("Saída do produto registrada!");
  }
};

//#endregion

//#region Funções para editar um item na lista do estoque, de acordo com entrada ou saída

const updateInventory = (code, quantity) => {
  var product = inventoryItems.find(item => item.codigo === code);
  product.quantidade += (quantity * 1)
  putItemInventory(product.codigo, product.nome, product.quantidade, product.valor).then((res) => {
    updateInventoryList(product.codigo, product.quantidade);
  });
};

const updateInventoryList = (code, qty) => {
  var table = document.getElementById("ProductInventory");
  for (var i = 0; i < table.rows.length; i++) {
    var row = table.rows[i];
    var codeValue = row.cells[0].innerText;
    if (codeValue == code) {
      row.cells[2].innerText = qty;
      break;
    }
  }
};

//#endregion

//#region Funções para inserir items na listas apresentadas

const addToInventoryList = (code, name, qty, value) => {
  var item = [code, name, qty, value]
  var table = document.getElementById("ProductInventory");
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertRemoveButton(row.insertCell(-1))
  document.getElementById("newCode").value = "";
  document.getElementById("newName").value = "";
  document.getElementById("newQty").value = "";
  document.getElementById("newValue").value = "";
};

const addToEntryList = (id, code, qty, date) => {
  var item = [id, code, qty, date]
  var table = document.getElementById("ProductEntry");
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertRemoveButton(row.insertCell(-1))
  document.getElementById("newCodeIn").value = "";
  document.getElementById("newQtyIn").value = "";
  document.getElementById("newDateIn").value = "";
};

const addToOutList = (id, code, qty, client, value, date) => {
  var item = [id, code, qty, client, value, date]
  var table = document.getElementById("ProductOut");
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertRemoveButton(row.insertCell(-1))
  document.getElementById("newCodeOut").value = "";
  document.getElementById("newQtyOut").value = "";
  document.getElementById("newClientOut").value = "";
  document.getElementById("newValueOut").value = "";
  document.getElementById("newDateOut").value = "";
};

//#endregion

//#region Funções para preencher o select com base nos produtos cadastrados no estoque (código e quantidade do disponpível para o código selecionado)

const populateCode = () => {
  let optionListIn = document.getElementById("newCodeIn");
  let optionListOut = document.getElementById("newCodeOut");
  while (optionListIn.options.length > 1) {
    optionListIn.remove(1)
    optionListOut.remove(1)
  }
  inventoryItems.forEach(item => {
    optionListIn.options.add(new Option(item.codigo, item.codigo))
    optionListOut.options.add(new Option(item.codigo, item.codigo))
  })
};

const newCodeIn = document.getElementById("newCodeIn");
const newCodeOut = document.getElementById("newCodeOut");
const newQtyIn = document.getElementById("newQtyIn");
const newQtyOut = document.getElementById("newQtyOut");

newCodeOut.addEventListener("change", () => {
  newQtyOut.innerHTML = "";
  if (newCodeOut.value) {
    newQtyOut.disabled = false;
    const quantity = inventoryItems.find(item => item.codigo === newCodeOut.value).quantidade;
    let quantityList = newQtyOut.options;
    for (i = 1; i <= quantity; i++) {
      quantityList.add(new Option(i, i));
    }
  }
});

//#endregion

//#region Funções para a parte dos gráficos

entryItems.forEach(entry => {
  entry.value = inventoryItems.find(item => item.codigo === entry.codigo).valor;
});

outItems.forEach(out => {
  out.value = inventoryItems.find(item => item.codigo === out.codigo).valor;
});

const loadAnalyticsData = () => {
  totalValuePI = inventoryItems.reduce(function (sum, item) {
    return sum + (item.quantidade * item.valor);
  }, 0);
  chartDataPI = inventoryItems.map(function (item) {
    return {
      name: item.nome,
      y: item.quantidade * item.valor,
      percent: (item.quantidade * item.valor / totalValuePI) * 100,
    };
  });
  chartDataEntry = inventoryItems.map(function (item) {
    return {
      name: item.nome,
      code: item.codigo,
      cost: item.valor / 2,
      quantity: 0,
      date: ""
    };
  });
  chartDataEntry.forEach(function (item) {
    entryItems.forEach(function (entry) {
      if (item.code === entry.codigo) {
        item.quantity += entry.quantidade;
        item.date = entry.data;
      }
    })
  })
  chartDataOut = inventoryItems.map(function (item) {
    return {
      name: item.nome,
      code: item.codigo,
      value: 0,
      quantity: 0,
      date:""
    }
  });
  chartDataOut.forEach(function (item) {
    outItems.forEach(function (out) {
      if (item.code === out.codigo) {
        item.quantity += out.quantidade;
        item.date = out.data;
        item.value += out.valor;
      }
    });
  });  
  var chart1Config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      backgroundColor: 'transparent',
      type: 'pie'
    },
    title: {
      text: 'Estoque de Produtos - Valor total: R$' + totalValuePI.toLocaleString('de-DE', {minimumFractionDigits: 2}),
      align: 'center',
      style: {
        color: '#4786bd'
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name} <br>R${point.y:.2f} - ({point.percent:.1f}%)'
        }
      }
    },
    series: [{
      type: 'pie',
      data: chartDataPI,

    }],
    tooltip: {
      headerFormat: '<span style="font-size: 12px;">{point.key}</span><br/>',
      pointFormat: 'R${point.y:.2f} - ({point.percent:.1f}%)',
      style: {
        fontSize: '10px'
      }
    }
  };
  var chart2Config = {
    chart: {
      type: 'column',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      backgroundColor: 'transparent',
    },
    title: {
      text: 'Entrada, saída e lucro por produto',
      align: 'center',
      style: {
        color: '#4786bd'
      }
    },
    xAxis: {
      categories: inventoryItems.map(item => item.codigo)
    },
    yAxis: {
      title: {
        text: 'Valor (R$)'
      }
    },
    series: [{
      name: 'Entrada',
      data: chartDataEntry.map(item => -item.cost),
      tooltip: {
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br/>',
        pointFormatter: function() {
          return 'Custo unitário <br>R$ ' + Highcharts.numberFormat(-this.y, 2);
        }
      }
    }, {
      name: 'Saída',
      data: chartDataOut.map(item => item.value),
      tooltip: {
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br/>',
        pointFormatter: function() {
          return 'Valor unitário <br>R$ ' + Highcharts.numberFormat(this.y, 2);
        }
      }
    }, {
      name: 'Lucro',
      data: chartDataEntry.map((item, index) => chartDataOut[index].value - item.cost),
      tooltip: {
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br/>',
        pointFormatter: function() {
          return 'Lucro unitário <br>R$ ' + Highcharts.numberFormat(this.y, 2);
        }
      }
    }]  
  };  
  Highcharts.chart('ProductInventoryAnalytics', chart1Config);
  Highcharts.chart('InOutAnalytics', chart2Config);
};

//#endregion

//#region Função para inicializar o site com todas as informações necessárias.

const init = () => {
  ProductEntryTable.style.display = "none";
  ProductOutTable.style.display = "none";
  ProductEntryInput.style.display = "none";
  ProductOutInput.style.display = "none";
  Analytics.style.display = "none";
  document.getElementById("ProductInventoryTitle").style.fontWeight = "800";
  getInventoryList();
  getEntriesList();
  getOutsList();
};

init();

//#endregion
