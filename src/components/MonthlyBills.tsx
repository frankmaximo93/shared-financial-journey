
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, X, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ptBR } from "date-fns/locale";

type MonthlyBillsProps = {
  isActive: boolean;
};

type Bill = {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'late' | 'upcoming';
  responsibility: 'casal' | 'franklin' | 'michele';
  category: string;
};

const MonthlyBills = ({ isActive }: MonthlyBillsProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: new Date(),
    responsibility: 'casal',
    category: 'Despesas Casa'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isActive) {
      fetchMonthlyBills();
    }
  }, [isActive, selectedMonth]);

  const fetchMonthlyBills = async () => {
    setIsLoading(true);
    try {
      // Simular dados para demonstração
      // No ambiente real, você faria uma chamada para a API
      setTimeout(() => {
        const mockBills: Bill[] = [
          {
            id: 1,
            name: 'Aluguel',
            amount: 1200,
            dueDate: '2025-03-10',
            status: 'pending',
            responsibility: 'casal',
            category: 'Despesas Casa'
          },
          {
            id: 2,
            name: 'Energia Elétrica',
            amount: 180,
            dueDate: '2025-03-15',
            status: 'paid',
            responsibility: 'franklin',
            category: 'Despesas Casa'
          },
          {
            id: 3,
            name: 'Internet',
            amount: 120,
            dueDate: '2025-03-20',
            status: 'upcoming',
            responsibility: 'michele',
            category: 'Despesas Casa'
          },
          {
            id: 4,
            name: 'Plano de Saúde',
            amount: 350,
            dueDate: '2025-03-05',
            status: 'late',
            responsibility: 'casal',
            category: 'Saúde'
          },
          {
            id: 5,
            name: 'Academia',
            amount: 90,
            dueDate: '2025-03-10',
            status: 'paid',
            responsibility: 'franklin',
            category: 'Lazer'
          }
        ];
        setBills(mockBills);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Erro ao buscar contas do mês:', error);
      toast.error('Erro ao carregar contas do mês');
      setIsLoading(false);
    }
  };

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const amount = parseFloat(newBill.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Valor precisa ser um número positivo');
      return;
    }

    // Simular adição de nova conta
    const newBillObject: Bill = {
      id: bills.length + 1,
      name: newBill.name,
      amount: amount,
      dueDate: format(newBill.dueDate, 'yyyy-MM-dd'),
      status: 'pending',
      responsibility: newBill.responsibility as 'casal' | 'franklin' | 'michele',
      category: newBill.category
    };

    setBills([...bills, newBillObject]);
    setNewBill({
      name: '',
      amount: '',
      dueDate: new Date(),
      responsibility: 'casal',
      category: 'Despesas Casa'
    });
    setShowAddForm(false);
    toast.success('Conta adicionada com sucesso!');
  };

  const handleChangeStatus = (id: number, newStatus: 'pending' | 'paid' | 'late' | 'upcoming') => {
    const updatedBills = bills.map(bill => 
      bill.id === id ? { ...bill, status: newStatus } : bill
    );
    setBills(updatedBills);
    
    const statusMessages = {
      paid: 'Conta marcada como paga!',
      pending: 'Conta marcada como pendente',
      late: 'Conta marcada como atrasada',
      upcoming: 'Conta marcada como próxima'
    };
    
    toast.success(statusMessages[newStatus]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Pago</Badge>;
      case 'late':
        return <Badge className="bg-red-500"><X className="h-3 w-3 mr-1" /> Atrasado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" /> Pendente</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> Próximo</Badge>;
      default:
        return null;
    }
  };

  const getTotalAmount = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const getPaidAmount = () => {
    return bills
      .filter(bill => bill.status === 'paid')
      .reduce((total, bill) => total + bill.amount, 0);
  };

  const getPendingAmount = () => {
    return bills
      .filter(bill => bill.status === 'pending' || bill.status === 'late')
      .reduce((total, bill) => total + bill.amount, 0);
  };

  if (!isActive) return null;

  return (
    <div className="animate-fade-in">
      <div className="glass-card rounded-2xl p-6 shadow-md">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-medium text-gray-800">Contas do Mês</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      !selectedMonth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedMonth ? (
                      format(selectedMonth, "MMMM yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione o mês</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedMonth}
                    onSelect={setSelectedMonth}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                variant="default"
              >
                {showAddForm ? 'Cancelar' : 'Nova Conta'}
              </Button>
            </div>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Nova Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="bill-name" className="text-sm font-medium">Nome da Conta</label>
                      <Input
                        id="bill-name"
                        placeholder="Ex: Aluguel, Energia..."
                        value={newBill.name}
                        onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bill-amount" className="text-sm font-medium">Valor (R$)</label>
                      <Input
                        id="bill-amount"
                        type="number"
                        placeholder="0,00"
                        value={newBill.amount}
                        onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data de Vencimento</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newBill.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newBill.dueDate ? format(newBill.dueDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newBill.dueDate}
                            onSelect={(date) => setNewBill({...newBill, dueDate: date || new Date()})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Responsabilidade</label>
                      <Select 
                        value={newBill.responsibility}
                        onValueChange={(value) => setNewBill({...newBill, responsibility: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casal">Casal</SelectItem>
                          <SelectItem value="franklin">Franklin</SelectItem>
                          <SelectItem value="michele">Michele</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categoria</label>
                      <Select
                        value={newBill.category}
                        onValueChange={(value) => setNewBill({...newBill, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Despesas Casa">Despesas Casa</SelectItem>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Lazer">Lazer</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleAddBill}>Adicionar Conta</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total</p>
                    <p className="text-2xl font-bold">R$ {getTotalAmount().toFixed(2)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Pago</p>
                    <p className="text-2xl font-bold">R$ {getPaidAmount().toFixed(2)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">Pendente</p>
                    <p className="text-2xl font-bold">R$ {getPendingAmount().toFixed(2)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse-shadow h-12 w-12 rounded-full bg-blue-500"></div>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Nenhuma conta registrada para este mês.</p>
              <Button onClick={() => setShowAddForm(true)} className="mt-4">
                Adicionar Nova Conta
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lista de Contas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nome</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Categoria</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Valor</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Vencimento</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Responsabilidade</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill) => (
                        <tr key={bill.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium">{bill.name}</td>
                          <td className="py-3 px-4 text-sm">{bill.category}</td>
                          <td className="py-3 px-4 text-sm font-medium">R$ {bill.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">
                            {format(new Date(bill.dueDate), 'dd/MM/yyyy')}
                          </td>
                          <td className="py-3 px-4 text-sm capitalize">{bill.responsibility}</td>
                          <td className="py-3 px-4 text-sm">
                            {getStatusBadge(bill.status)}
                          </td>
                          <td className="py-2 px-4 text-right">
                            <Select 
                              defaultValue={bill.status}
                              onValueChange={(value) => handleChangeStatus(
                                bill.id, 
                                value as 'pending' | 'paid' | 'late' | 'upcoming'
                              )}
                            >
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="paid">Pago</SelectItem>
                                <SelectItem value="late">Atrasado</SelectItem>
                                <SelectItem value="upcoming">Próximo</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyBills;
