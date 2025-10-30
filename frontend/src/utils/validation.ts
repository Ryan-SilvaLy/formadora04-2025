export type TarefaInput = {
  title: string;
  description?: string;
  date?: Date | string | null;
  time?: Date | string | null;
  category?: string;
};

export function validarTarefa(t: TarefaInput): string | null {
  if (!t.title || !t.title.trim()) {
    return "O título é obrigatório.";
  }

  // Permitir que a data seja string (ex: vinda do HTML)
  if (!t.date) {
    return "Selecione uma data para a tarefa.";
  }

  const dataObj = typeof t.date === "string" ? new Date(t.date) : t.date;
  if (isNaN(dataObj.getTime())) {
    return "Data inválida.";
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataSelecionada = new Date(dataObj);
  dataSelecionada.setHours(0, 0, 0, 0);

  if (dataSelecionada < hoje) {
    return "A data da tarefa não pode ser no passado.";
  }

  if (!t.category || !t.category.trim()) {
    return "Informe uma categoria.";
  }

  return null; // ✅ tudo certo
}
