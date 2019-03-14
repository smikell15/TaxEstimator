import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix="$"
    />
  );
}

class StartButton extends React.Component {
  constructor() {
    super()
    this.state = {
      isHidden: true
    }
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  render() {
    return (
      <div>
        {this.state.isHidden && <Button variant="contained" onClick={this.toggleHidden.bind(this)} >
        Start
        </Button>}
        {!this.state.isHidden &&
        <div>
          <label> Please Enter your income information </label>
          <br />
          <IncomeTable /> 
        </div>}
      </div>
    )
  }
}

const rows = [
];

let id = 0;
function addNewRow() {
  id += 1;
  rows.push({ id });
}

class IncomeTable extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  addRow() {
    addNewRow();
    this.setState({totalRows: rows.size});
  }

  handleChange(id, event) {
    this.setState({ [id]: event.target.value });
  }

  handleCheck(id, event) {
    this.setState({ [id]: event.target.checked });
  }

  getAmountRowValue(id) {
    let key = "amount"+id;
    return parseFloat(this.state[key], 10);
  }

  getTaxableRowValue(id) {
    let key = "taxable"+id;
    let taxFlag = this.state[key];
    if (taxFlag) return 1;
    return 0;
  }

  getTotal() {
    let total = 0;
    for(var i = 0; i < rows.length; ++i) {
      if (!isNaN(this.getAmountRowValue(rows[i].id))) {
        total += this.getAmountRowValue(rows[i].id);
      }
    }
    return total;
  }

  getTaxableTotal() {
    let total = 0;
    for(var i = 0; i < rows.length; ++i) {
      if (!isNaN(this.getAmountRowValue(rows[i].id)) && !isNaN(this.getTaxableRowValue(rows[i].id))) {
        total += this.getAmountRowValue(rows[i].id) * this.getTaxableRowValue(rows[i].id);
      }
    }
    return total;
  }

  getTaxAmount() {
    let total = this.getTaxableTotal();
    if (total < 9525) return .1 * total;
    if (total < 38700) return 952.50 + .12 * (total - 9525);
    if (total < 82500) return 4453.50 + .12 * (total - 38700);
    if (total < 157500) return 14089.50 + .12 * (total - 82500);
    if (total < 200000) return 32089.50 + .12 * (total - 157500);
    if (total < 500000) return 45689.50 + .12 * (total - 200000);
    else return 150689.50 + .37 * (total - 500000);
  }

  getNetIncome() {
    return this.getTotal() - this.getTaxAmount();
  }

  render() {
    return (
      <div>
        <Table>
          <colgroup>
            <col style={{width:'70%'}}/>
            <col style={{width:'20%'}}/>
            <col style={{width:'10%'}}/>
        </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell align="right">Income</TableCell>
              <TableCell align="right">Taxable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <TextField id={"sourceName"+row.id} fullWidth='true'/>
                </TableCell>
                <TableCell align="right">
                  <TextField  
                    id={"amount"+row.id}
                    value={this.getAmountRowValue(row.id)}
                    onChange={(e) => this.handleChange("amount"+row.id, e)}
                    InputProps={{ inputComponent: NumberFormatCustom,}} 
                    fullWidth='true' />
                </TableCell>
                <TableCell align="right">
                  <Checkbox 
                    id={"taxable"+row.id}
                    value={this.getTaxableRowValue(row.id)}
                    onChange={(e) => this.handleCheck("taxable"+row.id, e)}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <br />
        <Button variant="contained" onClick={() => this.addRow()} >Add Row</Button>
        <br />
        
        <Table style={{width:'50%'}}>
          <TableHead>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>Taxable Total</TableCell>
              <TableCell>Tax Amount</TableCell>
              <TableCell>Net Income</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <TableRow>
              <TableCell>{"$"+this.getTotal().toFixed(2)}</TableCell>
              <TableCell>{"$"+this.getTaxableTotal().toFixed(2)}</TableCell>
              <TableCell>{"$"+this.getTaxAmount().toFixed(2)}</TableCell>
              <TableCell>{"$"+this.getNetIncome().toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <StartButton />,
  document.getElementById('root')
);
