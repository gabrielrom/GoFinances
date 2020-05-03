import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  function convertValue(transactions: Transaction[]): void {
    transactions.forEach(transaction => {
      transaction.formattedValue = formatValue(transaction.value);
    });
  }

  function convertDate(transactions: Transaction[]): void {
    transactions.forEach(transaction => {
      transaction.formattedDate = formatDate(new Date(transaction.created_at));
    });
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');
      const { balance, transactions } = response.data;

      convertValue(transactions);
      convertDate(transactions);

      setBalance(balance);
      setTransactions(transactions);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header page="/" />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título
                  <FiChevronDown size={14} />
                </th>
                <th>
                  Preço
                  <FiChevronDown size={14} />
                </th>
                <th>
                  Categoria
                  <FiChevronDown size={14} />
                </th>
                <th>
                  Data
                  <FiChevronUp size={14} />
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'outcome'
                        ? `- ${transaction.formattedValue}`
                        : transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
