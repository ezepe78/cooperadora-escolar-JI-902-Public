import { format, subDays, startOfMonth, parseISO } from 'date-fns';

// Generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Categories
export const mockCategories = [
  { id: 'cat1', name: 'Cuotas', description: 'Cuotas mensuales de los socios', type: 'ingreso' },
  { id: 'cat2', name: 'Eventos', description: 'Ingresos por eventos escolares', type: 'ingreso' },
  { id: 'cat3', name: 'Donaciones', description: 'Donaciones recibidas', type: 'ingreso' },
  { id: 'cat4', name: 'Rifas', description: 'Ingresos por venta de rifas', type: 'ingreso' },
  { id: 'cat5', name: 'Kiosco', description: 'Ventas del kiosco escolar', type: 'ingreso' },
  { id: 'cat6', name: 'Material Didáctico', description: 'Compra de materiales para aulas', type: 'egreso' },
  { id: 'cat7', name: 'Mantenimiento', description: 'Gastos de mantenimiento del edificio', type: 'egreso' },
  { id: 'cat8', name: 'Servicios', description: 'Pago de servicios (luz, agua, etc)', type: 'egreso' },
  { id: 'cat9', name: 'Eventos Escolares', description: 'Gastos para eventos escolares', type: 'egreso' },
  { id: 'cat10', name: 'Equipamiento', description: 'Compra de equipos para la escuela', type: 'egreso' }
];

// Mock Accounts
export const mockAccounts = [
  { id: 'acc1', name: 'Caja Chica', description: 'Efectivo disponible para gastos menores' },
  { id: 'acc2', name: 'Banco Provincia', description: 'Cuenta bancaria principal' }
];

// Generate mock transactions for the current month
const today = new Date();
const startOfCurrentMonth = startOfMonth(today);

export const mockTransactions = [
  {
    id: generateId(),
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    categoryId: 'cat1',
    category: 'Cuotas',
    amount: 45000,
    type: 'ingreso',
    accountId: 'acc1',
    account: 'Caja Chica',
    details: 'Cuotas mensuales de 15 socios'
  },
  {
    id: generateId(),
    date: format(subDays(today, 3), 'yyyy-MM-dd'),
    categoryId: 'cat6',
    category: 'Material Didáctico',
    amount: 28500,
    type: 'egreso',
    accountId: 'acc1',
    account: 'Caja Chica',
    details: 'Compra de libros para biblioteca'
  },
  {
    id: generateId(),
    date: format(subDays(today, 5), 'yyyy-MM-dd'),
    categoryId: 'cat2',
    category: 'Eventos',
    amount: 75000,
    type: 'ingreso',
    accountId: 'acc2',
    account: 'Banco Provincia',
    details: 'Recaudación feria de ciencias'
  },
  {
    id: generateId(),
    date: format(subDays(today, 7), 'yyyy-MM-dd'),
    categoryId: 'cat7',
    category: 'Mantenimiento',
    amount: 35000,
    type: 'egreso',
    accountId: 'acc2',
    account: 'Banco Provincia',
    details: 'Reparación de cañerías'
  },
  {
    id: generateId(),
    date: format(subDays(today, 10), 'yyyy-MM-dd'),
    categoryId: 'cat3',
    category: 'Donaciones',
    amount: 50000,
    type: 'ingreso',
    accountId: 'acc2',
    account: 'Banco Provincia',
    details: 'Donación empresa local'
  },
  {
    id: generateId(),
    date: format(subDays(today, 12), 'yyyy-MM-dd'),
    categoryId: 'cat8',
    category: 'Servicios',
    amount: 18000,
    type: 'egreso',
    accountId: 'acc2',
    account: 'Banco Provincia',
    details: 'Pago factura de luz'
  },
  {
    id: generateId(),
    date: format(subDays(today, 15), 'yyyy-MM-dd'),
    categoryId: 'cat5',
    category: 'Kiosco',
    amount: 32000,
    type: 'ingreso',
    accountId: 'acc1',
    account: 'Caja Chica',
    details: 'Ventas kiosco primera quincena'
  },
  {
    id: generateId(),
    date: format(subDays(today, 18), 'yyyy-MM-dd'),
    categoryId: 'cat9',
    category: 'Eventos Escolares',
    amount: 42000,
    type: 'egreso',
    accountId: 'acc1',
    account: 'Caja Chica',
    details: 'Gastos día del maestro'
  }
];

// Generate monthly data
export const generateMockMonthlyData = (date) => {
  const monthKey = format(date, 'yyyy-MM');
  const isCurrentMonth = monthKey === format(today, 'yyyy-MM');
  
  // Base values
  const baseIngresos = isCurrentMonth ? 202000 : 185000;
  const baseEgresos = isCurrentMonth ? 123500 : 134000;
  const baseSaldoInicial = isCurrentMonth ? 350000 : 299000;
  
  // Calculate percentages
  const ingresosChange = isCurrentMonth ? 9.2 : -5.3;
  const egresosChange = isCurrentMonth ? -7.8 : 3.5;
  
  // Account distribution
  const cajaChicaPercent = isCurrentMonth ? 37.9 : 42.5;
  const bancoProvincia = 100 - cajaChicaPercent;
  
  // Category distribution for ingresos
  const ingresosCategorias = [
    { id: 'cat1', name: 'Cuotas', amount: baseIngresos * 0.45, percent: 45 },
    { id: 'cat2', name: 'Eventos', amount: baseIngresos * 0.25, percent: 25 },
    { id: 'cat3', name: 'Donaciones', amount: baseIngresos * 0.15, percent: 15 },
    { id: 'cat4', name: 'Rifas', amount: baseIngresos * 0.05, percent: 5 },
    { id: 'cat5', name: 'Kiosco', amount: baseIngresos * 0.10, percent: 10 }
  ];
  
  // Category distribution for egresos
  const egresosCategorias = [
    { id: 'cat6', name: 'Material Didáctico', amount: baseEgresos * 0.30, percent: 30 },
    { id: 'cat7', name: 'Mantenimiento', amount: baseEgresos * 0.25, percent: 25 },
    { id: 'cat8', name: 'Servicios', amount: baseEgresos * 0.20, percent: 20 },
    { id: 'cat9', name: 'Eventos Escolares', amount: baseEgresos * 0.15, percent: 15 },
    { id: 'cat10', name: 'Equipamiento', amount: baseEgresos * 0.10, percent: 10 }
  ];
  
  // Calculate account values
  const cajaChicaSaldoInicial = baseSaldoInicial * (cajaChicaPercent / 100);
  const bancoProvinciaSaldoInicial = baseSaldoInicial * (bancoProvincia / 100);
  
  const cajaChicaIngresos = baseIngresos * 0.4;
  const bancoProvinciaIngresos = baseIngresos * 0.6;
  
  const cajaChicaEgresos = baseEgresos * 0.55;
  const bancoProvinciaEgresos = baseEgresos * 0.45;
  
  return {
    saldoInicial: baseSaldoInicial,
    totalIngresos: baseIngresos,
    totalEgresos: baseEgresos,
    saldoFinal: baseSaldoInicial + baseIngresos - baseEgresos,
    ingresosChange,
    egresosChange,
    ingresosCategorias,
    egresosCategorias,
    accounts: [
      {
        id: 'acc1',
        name: 'Caja Chica',
        saldoInicial: cajaChicaSaldoInicial,
        ingresos: cajaChicaIngresos,
        egresos: cajaChicaEgresos,
        saldoFinal: cajaChicaSaldoInicial + cajaChicaIngresos - cajaChicaEgresos,
        percent: cajaChicaPercent
      },
      {
        id: 'acc2',
        name: 'Banco Provincia',
        saldoInicial: bancoProvinciaSaldoInicial,
        ingresos: bancoProvinciaIngresos,
        egresos: bancoProvinciaEgresos,
        saldoFinal: bancoProvinciaSaldoInicial + bancoProvinciaIngresos - bancoProvinciaEgresos,
        percent: bancoProvincia
      }
    ]
  };
};
