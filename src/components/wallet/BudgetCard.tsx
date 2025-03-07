
import { WalletData } from '@/utils/walletUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/walletUtils';

type BudgetCardProps = {
  wallet: WalletData;
};

const BudgetCard = ({ wallet }: BudgetCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Orçamento utilizado</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">Gastos vs. Receitas</span>
            <span className="text-sm font-medium">
              {wallet.income > 0 ? Math.round((wallet.expenses / wallet.income) * 100) : 0}%
            </span>
          </div>
          <Progress 
            value={wallet.income > 0 ? (wallet.expenses / wallet.income) * 100 : 0} 
            className="h-2 bg-gray-200"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Consumo total</p>
          <p className="text-xl font-medium text-finance-expense">{formatCurrency(wallet.expenses)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
