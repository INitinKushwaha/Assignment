import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Collapse } from '@material-ui/core';
import './App.css'; // Import your CSS file

const App = () => {
  const [holdings, setHoldings] = useState([]);
  const [groupedHoldings, setGroupedHoldings] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    async function fetchHoldings() {
      try {
        const response = await axios.get('https://canopy-frontend-task.now.sh/api/holdings');
        setHoldings(response.data.payload);
      } catch (error) {
        console.error('Error fetching holdings:', error);
      }
    }

    fetchHoldings();
  }, []);

  useEffect(() => {
    const grouped = holdings.reduce((acc, holding) => {
      acc[holding.asset_class] = acc[holding.asset_class] || [];
      acc[holding.asset_class].push(holding);
      return acc;
    }, {});
    setGroupedHoldings(grouped);
  }, [holdings]);

  const handleGroupExpand = (assetClass) => {
    setExpandedGroups((prevExpanded) => ({
      ...prevExpanded,
      [assetClass]: !prevExpanded[assetClass],
    }));
  };

  return (
    <div className="holdings-table">
      {Object.keys(groupedHoldings).map((assetClass) => (
        <div key={assetClass}>
          <Typography variant="h6" onClick={() => handleGroupExpand(assetClass)} className="asset-class-header">
            {assetClass}
          </Typography>
          <Collapse in={expandedGroups[assetClass]} timeout="auto" unmountOnExit>
            <TableContainer component={Paper}>
              <Table aria-label="holdings table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Ticker</TableCell>
                    <TableCell>Average Price</TableCell>
                    <TableCell>Market Price</TableCell>
                    <TableCell>Latest Change (%)</TableCell>
                    <TableCell>Market Value (Base CCY)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedHoldings[assetClass].map((holding) => (
                    <TableRow key={holding.ticker}>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell>{holding.ticker}</TableCell>
                      <TableCell>{holding.avg_price}</TableCell>
                      <TableCell>{holding.market_price}</TableCell>
                      <TableCell>{holding.latest_chg_pct}</TableCell>
                      <TableCell>{holding.market_value_ccy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export default App;
