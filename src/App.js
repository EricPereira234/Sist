import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./RelatorioParoquial.css";

const questions = [
  { id: 'parish', question: 'Qual o nome da Paróquia?', icon: '⛪', placeholder: 'Ex: Nossa Senhora do Perpétuo Socorro' },
  { id: 'month', question: 'Qual o mês do relatório?', icon: '📅', placeholder: 'Ex: Setembro' },
  { id: 'year', question: 'Qual o ano?', icon: '📆', placeholder: 'Ex: 2025' },
  { id: 'parocoNome', question: 'Qual o nome do Padre?', icon: '👨‍⚖️', placeholder: 'Ex: Osmar Rodrigues de Jesus' },
  { id: 'parocoCargo', question: 'Qual o cargo?', icon: '📜', placeholder: 'Ex: Pároco' },
  { id: 'b0_1', question: 'Quantos batizados de 0 a 1 ano?', icon: '👶', placeholder: 'Digite o número' },
  { id: 'b1_7', question: 'Quantos batizados de 1 a 7 anos?', icon: '🧒', placeholder: 'Digite o número' },
  { id: 'b7p', question: 'Quantos batizados acima de 7 anos?', icon: '👦', placeholder: 'Digite o número' },
  { id: 'eucaristia', question: 'Quantas 1ª Eucaristias?', icon: '🍞', placeholder: 'Digite o número' },
  { id: 'crisma', question: 'Quantas Crismas?', icon: '🕊️', placeholder: 'Digite o número' },
  { id: 'casamento', question: 'Quantos Casamentos?', icon: '💒', placeholder: 'Digite o número' },
  { id: 'uncao', question: 'Quantas Unções dos Enfermos?', icon: '🙏', placeholder: 'Digite o número' },
  { id: 'confissao', question: 'Quantas Confissões?', icon: '✝️', placeholder: 'Digite o número' },
];

const financeQuestions = [
  { id: 'dizimo_matriz', label: 'Dízimo - MATRIZ', icon: '💰' },
  { id: 'dizimo_comunidade', label: 'Dízimo - COMUNIDADE', icon: '💰' },
  { id: 'alugueis', label: 'Aluguéis - Imóveis', icon: '🏠' },
  { id: 'festejo_matriz', label: 'Festejo - MATRIZ', icon: '🎉' },
  { id: 'festejo_comunidade', label: 'Festejo - COMUNIDADE', icon: '🎉' },
  { id: 'coleta_matriz', label: 'Coletas - Matriz', icon: '🎁' },
  { id: 'crisma_fin', label: 'Crisma', icon: '🕊️' },
  { id: 'fraternidade', label: 'Campanha da Fraternidade', icon: '🤝' },
  { id: 'terra_santa', label: 'Terra Santa', icon: '🌍' },
  { id: 'sao_pedro', label: 'São Pedro', icon: '🔑' },
  { id: 'missoes', label: 'Missões', icon: '✈️' },
  { id: 'evangelizacao', label: 'Evangelização', icon: '📖' },
  { id: 'vocacional', label: 'Vocacional', icon: '🙌' },
  { id: 'intencoes_matriz', label: 'Intenções - MATRIZ', icon: '🕯️' },
  { id: 'intencoes_comunidade', label: 'Intenções - COMUNIDADE', icon: '🕯️' },
  { id: 'plano_saude', label: 'Plano de Saúde - Paroquial', icon: '🏥' },
  { id: 'contabilidade', label: 'Contabilidade', icon: '📊' },
  { id: 'theos', label: 'Thèos', icon: '📚' },
  { id: 'amigos_benfeitores', label: 'Amigos benfeitores do seminário', icon: '🎓' },
  { id: 'fundo_veiculo', label: 'Fundo de aquisição de veículos', icon: '🚗' },
  { id: 'fundo_clero', label: 'Fundo de Manutenção do Clero', icon: '⛪' },
  { id: 'saldo_comunidades', label: 'Total dos Saldos das Comunidades', icon: '💵' },
];

export default function RelatorioParoquial() {
  const printRef = useRef();
  const [step, setStep] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentValue, setCurrentValue] = useState('');
  const [data, setData] = useState({});
  const [finances, setFinances] = useState({});

  const allQuestions = [...questions, ...financeQuestions];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const handleStart = () => {
    setStep('questions');
  };

  const handleNext = () => {
    const current = allQuestions[currentQuestion];
    
    if (currentValue.trim()) {
      if (current.id) {
        if (currentQuestion < questions.length) {
          setData(prev => ({ ...prev, [current.id]: currentValue }));
        } else {
          setFinances(prev => ({ ...prev, [current.id]: currentValue }));
        }
      }
    }

    setCurrentValue('');

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('preview');
    }
  };

  const handleSkip = () => {
    setCurrentValue('');
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('preview');
    }
  };

  const handleEdit = () => {
    setStep('welcome');
    setCurrentQuestion(0);
    setCurrentValue('');
  };

  const generatePDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Relatorio-${data.parish || 'paroquia'}-${data.month || ''}.pdf`);
  };

  const currentQ = allQuestions[currentQuestion];
  const totalBatizados = (parseInt(data.b0_1) || 0) + (parseInt(data.b1_7) || 0) + (parseInt(data.b7p) || 0);

  const financeData = [
    { desc: 'Dízimo - MATRIZ', valor: finances.dizimo_matriz || '', repasse: 10 },
    { desc: 'Dízimo - COMUNIDADE', valor: finances.dizimo_comunidade || '', repasse: 10 },
    { desc: 'Aluguéis - Imóveis', valor: finances.alugueis || '', repasse: 10 },
    { desc: 'Festejo - MATRIZ', valor: finances.festejo_matriz || '', repasse: 10 },
    { desc: 'Festejo - COMUNIDADE', valor: finances.festejo_comunidade || '', repasse: 10 },
    { desc: 'Coletas - Matriz', valor: finances.coleta_matriz || '', repasse: 10 },
    { desc: 'Crisma', valor: finances.crisma_fin || '', repasse: 100 },
    { desc: 'Campanha da Fraternidade', valor: finances.fraternidade || '', repasse: 100 },
    { desc: 'Terra Santa', valor: finances.terra_santa || '', repasse: 100 },
    { desc: 'São Pedro', valor: finances.sao_pedro || '', repasse: 100 },
    { desc: 'Missões', valor: finances.missoes || '', repasse: 100 },
    { desc: 'Evangelização', valor: finances.evangelizacao || '', repasse: 100 },
    { desc: 'Vocacional', valor: finances.vocacional || '', repasse: 100 },
    { desc: 'Intenções - MATRIZ', valor: finances.intencoes_matriz || '', repasse: 50 },
    { desc: 'Intenções - COMUNIDADE', valor: finances.intencoes_comunidade || '', repasse: 50 },
    { desc: 'Plano de Saúde - Paroquial', valor: finances.plano_saude || '', repasse: 50 },
    { desc: 'Contabilidade', valor: finances.contabilidade || '', repasse: 100 },
    { desc: 'Thèos', valor: finances.theos || '', repasse: 100 },
    { desc: 'Amigos benfeitores do seminário', valor: finances.amigos_benfeitores || '', repasse: 100 },
    { desc: 'Fundo de aquisição de veículos', valor: finances.fundo_veiculo || '', repasse: 100 },
    { desc: 'Cont. Fundo de Manutenção do Clero', valor: finances.fundo_clero || '', repasse: 100 }
  ];

  // Calcula a receita bruta (apenas valores com 10% de repasse)
  const calcReceitaBruta = () => {
    const valoresComDezPorcento = financeData
      .filter(item => item.repasse === 10)
      .reduce((sum, item) => {
        const val = parseFloat(item.valor.replace(",", ".")) || 0;
        return sum + val;
      }, 0);
    return valoresComDezPorcento;
  };

  // Calcula o repasse de 3% sobre a receita bruta
  const calcRepasseReceitaBruta = () => {
    return calcReceitaBruta() * 0.03;
  };

  // Total Paroquial = soma de todos os repasses
  const calcTotalParoquial = () => {
    let total = 0;
    
    // Repasses dos itens normais
    financeData.forEach(item => {
      const val = parseFloat(item.valor.replace(",", ".")) || 0;
      total += (val * item.repasse / 100);
    });
    
    // Adiciona o 3% da receita bruta
    total += calcRepasseReceitaBruta();
    
    return total;
  };

  return (
    <>
      <div className="app-container">
        {step === 'welcome' && (
          <div className="welcome-screen">
            <div className="welcome-icon">📋</div>
            <h1 className="welcome-title">Relatório Paroquial</h1>
            <p className="welcome-text">
              Vamos preencher seu relatório paroquial de forma simples e rápida.<br/>
              Responda as perguntas uma por uma, ou pule as que não se aplicam.
            </p>
            <button className="welcome-btn" onClick={handleStart}>
              Começar Preenchimento ✨
            </button>
          </div>
        )}

        {step === 'questions' && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-text">
                  Pergunta {currentQuestion + 1} de {totalQuestions}
                </div>
              </div>

              <div className="modal-header">
                <div className="modal-icon">{currentQ.icon}</div>
                <h2 className="modal-title">{currentQ.question || currentQ.label}</h2>
                <p className="modal-subtitle">Preencha o campo abaixo ou pule para continuar</p>
              </div>

              <input
                type="text"
                className="modal-input"
                placeholder={currentQ.placeholder || 'Digite o valor em R$'}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                autoFocus
              />
              
              {currentQuestion >= questions.length && (
                <div className="modal-hint">💡 Valores monetários podem usar vírgula ou ponto</div>
              )}

              <div className="modal-buttons">
                <button className="modal-btn modal-btn-skip" onClick={handleSkip}>
                  Pular
                </button>
                <button className="modal-btn modal-btn-next" onClick={handleNext}>
                  {currentQuestion < totalQuestions - 1 ? 'Próximo' : 'Finalizar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="pdf-preview">
            <div className="preview-header">
              <h2 className="preview-title">📄 Seu Relatório está Pronto!</h2>
              <div className="action-buttons">
                <button className="btn-action btn-edit" onClick={handleEdit}>
                  ✏️ Refazer
                </button>
                <button className="btn-action btn-download" onClick={generatePDF}>
                  📥 Baixar PDF
                </button>
              </div>
            </div>

            <div ref={printRef} className="pdf-content">
              <div className="pdf-header">
                <h1>RELATÓRIO PAROQUIAL</h1>
                <div className="pdf-header-info">
                  <span><strong>PARÓQUIA:</strong> {data.parish || ''}</span>
                  <span><strong>MÊS:</strong> {data.month || ''}</span>
                  <span><strong>ANO:</strong> {data.year || ''}</span>
                </div>
              </div>

              <div className="pdf-section-title">ESTATÍSTICAS</div>
              <table className="stats-table">
                <tbody>
                  <tr>
                    <td>BATIZADOS</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>0 a 01 ANO</td>
                    <td>{data.b0_1 || ''}</td>
                    <td>1 a 07 ANOS</td>
                    <td>{data.b1_7 || ''}</td>
                    <td>+7 ANOS</td>
                    <td>{data.b7p || ''}</td>
                    <td>TOTAL</td>
                    <td>{totalBatizados || ''}</td>
                  </tr>
                  <tr>
                    <td>1ª EUCARISTIAS</td>
                    <td>{data.eucaristia || ''}</td>
                    <td>CRISMAS</td>
                    <td>{data.crisma || ''}</td>
                    <td>CASAMENTOS</td>
                    <td>{data.casamento || ''}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>UNÇ. DOS ENF.</td>
                    <td>{data.uncao || ''}</td>
                    <td>CONFISSÕES</td>
                    <td>{data.confissao || ''}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor Total Paroquial - R$</th>
                    <th>Repasse Diocese</th>
                    <th>Valor Repasse R$</th>
                  </tr>
                </thead>
                <tbody>
                  {financeData.map((item, idx) => {
                    const valor = parseFloat(item.valor.replace(",", ".")) || 0;
                    const repasseValor = valor * item.repasse / 100;
                    return (
                      <tr key={idx}>
                        <td>{item.desc}</td>
                        <td>{valor > 0 ? valor.toFixed(2).replace(".", ",") : ""}</td>
                        <td>{item.repasse}%</td>
                        <td>{repasseValor > 0 ? repasseValor.toFixed(2).replace(".", ",") : ""}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td>Patrimônio do clero - Receita bruta</td>
                    <td>{calcReceitaBruta() > 0 ? calcReceitaBruta().toFixed(2).replace(".", ",") : ""}</td>
                    <td>3%</td>
                    <td>{calcRepasseReceitaBruta() > 0 ? calcRepasseReceitaBruta().toFixed(2).replace(".", ",") : ""}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total Paroquial</strong></td>
                    <td colSpan="3"><strong>{calcTotalParoquial().toFixed(2).replace(".", ",")}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>TOTAL SALDO DAS COMUNIDADES R$ =</strong></td>
                    <td colSpan="3"><strong>{Number(finances.saldo_comunidades || 0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL',})}</strong></td>
                  </tr>
                </tfoot>
              </table>

              <div className="pdf-footer">
                <div className="pdf-footer-date">
                  Cocal - PI, {new Date().toLocaleDateString('pt-BR')}
                </div>
                <div className="pdf-footer-signature">
                  <div className="pdf-footer-line"></div>
                  {data.parocoNome ? `Pe. ${data.parocoNome}` : ''}<br/>
                  {data.parocoCargo || ''}
                </div>
                <div className="pdf-notes">
                  <p>1. Esta Prestação de contas deve ser entregue na cúria Diocesana até o dia 10 do mês seguinte, acompanhada do respectivo valor do relatório.</p>
                  <p>Em anexo as documentações originais referentes aos colaboradores – Folha de Pagamento ( ) e xerox comprovante INSS( ), FGTS( ), Côngrua ( )</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}