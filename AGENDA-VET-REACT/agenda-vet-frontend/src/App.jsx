import React, { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = 'http://localhost:3000/api';
const API_URL_PETS = `${API_BASE}/pets`;
const API_URL_CONSULTAS = `${API_BASE}/consultas`;


const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });


const ConfirmationModal = ({ modal }) => {
  const { message, onConfirm, onCancel } = modal;
  
  const handleBackdropClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform scale-100 transition-transform duration-300">
        <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.372 17c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Confirmação Necessária
        </h3>
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition duration-150"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-150 shadow-md"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------------------------------------------------------

// Componente principal da aplicação
const App = () => {

  const [view, setView] = useState('menu'); 
  const [globalMessage, setGlobalMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const [modal, setModal] = useState({ 
    isOpen: false, 
    message: '', 
    onConfirm: () => {}, 
    onCancel: () => {} 
  });

  const showMessage = useCallback((text, type = 'success') => {
    setGlobalMessage({ type, text });
    setTimeout(() => setGlobalMessage({ type: '', text: '' }), 3000);
  }, []);

  const askForConfirmation = useCallback((message, onConfirmCallback) => {
    setModal({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirmCallback();
        setModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, []);


  const messageClasses = useMemo(() => ({
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  }), []);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-4xl mb-6">
        <h1 className="text-4xl font-extrabold text-green-800 text-center mt-6 mb-2">
          Agenda Veterinária 🐾
        </h1>
        <p className="text-center text-green-600 mb-6">
          Gestão de Pets e Consultas com React, Vite e Tailwind CSS.
        </p>
        <nav className="flex justify-center space-x-4">
          <button 
            onClick={() => setView('menu')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
          >
            Menu Principal
          </button>
          <button 
            onClick={() => setView('pets')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
          >
            Gestão de Pets
          </button>
          <button 
            onClick={() => setView('consultas')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
          >
            Agendar Consultas
          </button>
        </nav>
      </header>

      {globalMessage.text && (
        <div className={`w-full max-w-4xl p-3 mb-4 border-l-4 rounded shadow-md ${messageClasses[globalMessage.type]}`}>
          {globalMessage.text}
        </div>
      )}
      
      {/* NOVO: Renderiza o Modal de Confirmação */}
      {modal.isOpen && <ConfirmationModal modal={modal} />}

      <main className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-2xl relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10 rounded-xl">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xl font-semibold text-green-600">Carregando...</span>
          </div>
        )}

        {view === 'menu' && <MenuScreen />}
        {view === 'pets' && <PetManagement 
          showMessage={showMessage} 
          setLoading={setLoading} 
          askForConfirmation={askForConfirmation}
        />}
        {view === 'consultas' && <ConsultationScheduling 
          showMessage={showMessage} 
          setLoading={setLoading} 
          askForConfirmation={askForConfirmation}
        />}
      </main>
    </div>
  );
};

// --------------------------------------------------------------------------------------------------------------------------

// --- TELAS / ROTAS ---

const MenuScreen = () => (
  <div className="text-center py-12">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao Sistema!</h2>
    <p className="text-lg text-gray-600">Use os botões de navegação acima para gerenciar os pets e agendar as consultas veterinárias.</p>
    <div className="mt-8 flex justify-center space-x-6">
      <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 bg-blue-50 border-blue-200">
        <span className="text-4xl">🐶</span>
        <p className="mt-3 text-lg font-medium text-blue-600">Gerencie o cadastro de seus pacientes (pets).</p>
      </div>
      <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 bg-red-50 border-red-200">
        <span className="text-4xl">🩺</span>
        <p className="mt-3 text-lg font-medium text-red-600">Agende e acompanhe as consultas.</p>
      </div>
    </div>
  </div>
);

// --------------------------------------------------------------------------------------------------------------------------

// --- GESTÃO DE PETS ---

const PetManagement = ({ showMessage, setLoading, askForConfirmation }) => {
  const initialPetState = { id_pet: null, nome: '', especie: '', raca: '', idade: '', dono: '' };
  const [petForm, setPetForm] = useState(initialPetState);
  const [pets, setPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchPets = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const url = query 
        ? `${API_URL_PETS}?busca=${encodeURIComponent(query)}`
        : API_URL_PETS;

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao carregar pets");
      setPets(data);
      if (query && data.length === 0) {
        showMessage(`Nenhum Pet encontrado com o nome '${query}'.`, 'info');
      }
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      showMessage(error.message || "Falha ao carregar a lista de pets.", 'error');
    } finally {
      setLoading(false);
    }
  }, [showMessage, setLoading]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoadPetForEdit = async (petId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_PETS}/${petId}`);
      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || `Pet com ID ${petId} não encontrado.`, 'error');
        setPetForm(initialPetState);
        setIsEditing(false);
        return;
      }
      
      setPetForm(data);
      setIsEditing(true);
      showMessage(`Pet '${data.nome}' carregado para edição.`, 'info');

    } catch (error) {
      console.error("Erro na busca:", error);
      showMessage("Erro ao buscar pet. Verifique o ID e o backend.", 'error');
      setPetForm(initialPetState);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!petForm.nome || !petForm.especie || !petForm.dono) {
      showMessage("Nome, Espécie e Dono são obrigatórios.", 'error');
      return;
    }

    setLoading(true);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL_PETS}/${petForm.id_pet}` : API_URL_PETS;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petForm),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} pet`);

      showMessage(`Pet ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
      setPetForm(initialPetState);
      setIsEditing(false);
      setSearchQuery(''); 
      fetchPets(); 
    } catch (error) {
      console.error("Erro na operação:", error);
      showMessage(error.message || `Falha ao ${isEditing ? 'atualizar' : 'cadastrar'} pet.`, 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteAction = async (id, nome) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_PETS}/${id}`, { method: 'DELETE' });
      
      let successMessage = `Pet ${nome} deletado com sucesso.`;

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json(); 
        } catch (e) {
            errorData = { message: `Erro no servidor: Status ${response.status}.` };
        }
        throw new Error(errorData.message || "Erro ao deletar pet");
      }

      if (response.status !== 204) {
          try {
              const data = await response.json();
              successMessage = data.message || successMessage;
          } catch (e) {
              console.warn("Deleção bem-sucedida, mas falha ao ler o corpo JSON da resposta.", e);
          }
      } 
      
      showMessage(successMessage, 'success');
      fetchPets();
      
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      showMessage(error.message || "Falha ao deletar pet.", 'error');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = (id, nome) => {
    askForConfirmation(
      `Tem certeza que deseja deletar o Pet "${nome}" (ID: ${id})? Todas as consultas associadas a ele também serão deletadas.`,
      () => handleDeleteAction(id, nome)
    );
  };


  const handleCancelEdit = () => {
    setPetForm(initialPetState);
    setIsEditing(false);
    setSearchQuery(''); 
    showMessage("Modo de edição cancelado.", 'info');
  };

  return (
    <div className="space-y-8">
      
      <div className="p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">🔍 Buscar Pet por Nome</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Digite o nome (ou parte do nome) do pet"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            aria-label="Nome do Pet para busca"
          />
          <button
            onClick={() => fetchPets(searchQuery)}
            type="button"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
          >
            Pesquisar
          </button>
          <button
            onClick={() => { setSearchQuery(''); fetchPets(''); }}
            type="button"
            className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-150 shadow-md"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Formulário de Cadastro/Edição */}
      <form onSubmit={handleSubmit} className="p-6 bg-green-50 rounded-lg shadow-md border border-green-200">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          {isEditing ? `✏️ Editar Pet (ID: ${petForm.id_pet})` : '➕ Cadastrar Novo Pet'}
        </h2>
        
        {isEditing && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-lg">
            Você está editando o Pet: <strong>{petForm.nome}</strong>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(initialPetState).filter(key => key !== 'id_pet').map(key => (
            <div className="flex flex-col" key={key}>
              <label htmlFor={key} className="text-sm font-medium text-gray-700 capitalize">
                {key === 'dono' ? 'Nome do Dono' : key}
                {key === 'idade' && ' (em anos)'}:
              </label>
              <input
                type={key === 'idade' ? 'number' : 'text'}
                id={key}
                name={key}
                value={petForm[key]}
                onChange={handleInputChange}
                required
                className="p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 mt-1"
                min={key === 'idade' ? '0' : undefined}
                placeholder={`Digite o ${key === 'dono' ? 'nome do dono' : key}...`}
                autoComplete="off"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-3 mt-6">
          <button 
            type="submit"
            className={`px-6 py-2 text-white font-semibold rounded-lg transition duration-150 shadow-md ${
              isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Pet'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-150 shadow-md"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      {/* Tabela de Pets Cadastrados */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Pets Cadastrados ({pets.length})</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Nome', 'Espécie', 'Raça', 'Idade', 'Dono', 'Ações'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pets.map((pet) => (
                <tr key={pet.id_pet} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.id_pet}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.especie}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.raca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.idade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.dono}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => handleLoadPetForEdit(pet.id_pet)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 p-1 rounded-md transition duration-150"
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(pet.id_pet, pet.nome)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-1 rounded-md transition duration-150"
                      title="Deletar"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
              {pets.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Nenhum pet cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------------------------------------------------------
// --- AGENDAMENTO DE CONSULTAS ---

const ConsultationScheduling = ({ showMessage, setLoading, askForConfirmation }) => {
  const initialConsultaState = { id_pet: null, nomePet: '', nomeDono: '', veterinario: '', data: '', hora: '', motivo: '' };
  const [consultaForm, setConsultaForm] = useState(initialConsultaState);
  const [consultas, setConsultas] = useState([]);
  const [searchIdPet, setSearchIdPet] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchConsultas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_CONSULTAS);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao carregar consultas");
      setConsultas(data);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      showMessage(error.message || "Falha ao carregar a lista de consultas.", 'error');
    } finally {
      setLoading(false);
    }
  }, [showMessage, setLoading]);

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  const handlePetSearch = async () => {
    const petId = parseInt(searchIdPet, 10);
    if (isNaN(petId) || petId <= 0) {
      showMessage("Por favor, digite um ID de Pet válido.", 'info');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_PETS}/${petId}`);
      const pet = await response.json();

      if (!response.ok) {
        showMessage(pet.message || `Pet com ID ${petId} não encontrado.`, 'error');
        setConsultaForm(initialConsultaState);
        return;
      }

      setConsultaForm(prev => ({
        ...prev,
        id_pet: pet.id_pet,
        nomePet: pet.nome,
        nomeDono: pet.dono,
      }));
      showMessage(`Pet '${pet.nome}' encontrado e formulário preenchido.`, 'success');

    } catch (error) {
      console.error("Erro na busca do Pet:", error);
      showMessage("Erro ao buscar pet. Verifique o ID e o backend.", 'error');
      setConsultaForm(initialConsultaState);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!consultaForm.id_pet) {
      showMessage("Busque e selecione um Pet válido antes de agendar.", 'error');
      return;
    }
    if (!consultaForm.veterinario || !consultaForm.data || !consultaForm.hora || !consultaForm.motivo) {
        showMessage("Preencha todos os campos obrigatórios da consulta.", 'error');
        return;
    }


    setLoading(true);

    const payload = {
      id_pet: consultaForm.id_pet,
      veterinario: consultaForm.veterinario,
      data: consultaForm.data,
      hora: consultaForm.hora,
      motivo: consultaForm.motivo,
      status: 'Agendada' 
    };
    
    try {
      const response = await fetch(API_URL_CONSULTAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao agendar consulta");

      showMessage("Consulta agendada com sucesso!", 'success');
      setConsultaForm(initialConsultaState);
      setSearchIdPet('');
      fetchConsultas();

    } catch (error) {
      console.error("Erro no agendamento:", error);
      showMessage(error.message || "Falha ao agendar consulta. Verifique se todos os campos estão corretos.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAction = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_CONSULTAS}/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao deletar consulta");
      
      showMessage("Consulta deletada com sucesso!", 'success');
      fetchConsultas();
    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
      showMessage(error.message || "Falha ao deletar consulta.", 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = (id) => {
    askForConfirmation(
      "Tem certeza que deseja deletar esta consulta? Esta ação não pode ser desfeita.",
      () => handleDeleteAction(id)
    );
  };
  
  const handleSearchConsultas = async (query) => {
    if (!query) return fetchConsultas(); 

    setLoading(true);
    try {
      const response = await fetch(`${API_URL_CONSULTAS}/buscar?veterinario=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro ao buscar consultas.");
      
      setConsultas(data);
      showMessage(`Encontradas ${data.length} consultas.`, 'info');

    } catch (error) {
      console.error("Erro na busca de consultas:", error);
      showMessage(error.message || "Falha na busca de consultas.", 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* Formulário de Agendamento */}
      <form onSubmit={handleSubmit} className="p-6 bg-red-50 rounded-lg shadow-md border border-red-200">
        <h2 className="text-2xl font-bold text-red-700 mb-4">🩺 Agendar Nova Consulta</h2>
        
        {/* Busca de Pet por ID */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <label htmlFor="searchIdPet" className="text-sm font-medium text-gray-700 block mb-2">
            1. Buscar ID do Pet:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              id="searchIdPet"
              placeholder="Digite o ID do pet (Ex: 1)"
              value={searchIdPet}
              onChange={(e) => setSearchIdPet(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              min="1"
              aria-label="ID do Pet para agendamento"
            />
            <button
              type="button"
              onClick={handlePetSearch}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
            >
              Buscar Pet
            </button>
          </div>
        </div>

        {/* Campos preenchidos automaticamente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="nomePet" className="text-sm font-medium text-gray-700">Nome do Pet (Auto):</label>
            <input
              type="text"
              id="nomePet"
              value={consultaForm.nomePet}
              readOnly
              className="p-2 border border-gray-300 rounded-lg bg-gray-50 mt-1"
              placeholder="Busque o Pet primeiro"
            />
            </div>
          <div className="flex flex-col">
            <label htmlFor="nomeDono" className="text-sm font-medium text-gray-700">Nome do Dono (Auto):</label>
            <input
              type="text"
              id="nomeDono"
              value={consultaForm.nomeDono}
              readOnly
              className="p-2 border border-gray-300 rounded-lg bg-gray-50 mt-1"
              placeholder="Busque o Pet primeiro"
            />
          </div>
        </div>
        
        {/* Informações da Consulta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="flex flex-col">
            <label htmlFor="veterinario" className="text-sm font-medium text-gray-700">Nome do Veterinário:</label>
            <input
              type="text"
              id="veterinario"
              name="veterinario"
              value={consultaForm.veterinario}
              onChange={(e) => setConsultaForm(prev => ({ ...prev, veterinario: e.target.value }))}
              required
              className="p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 mt-1"
              placeholder="Dr(a). Exemplo"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="data" className="text-sm font-medium text-gray-700">Data da Consulta:</label>
            <input
              type="date"
              id="data"
              name="data"
              value={consultaForm.data}
              onChange={(e) => setConsultaForm(prev => ({ ...prev, data: e.target.value }))}
              required
              className="p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="hora" className="text-sm font-medium text-gray-700">Hora da Consulta:</label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={consultaForm.hora}
              onChange={(e) => setConsultaForm(prev => ({ ...prev, hora: e.target.value }))}
              required
              className="p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 mt-1"
            />
          </div>
        </div>
        
        <div className="flex flex-col mt-4">
          <label htmlFor="motivo" className="text-sm font-medium text-gray-700">Motivo da Consulta:</label>
          <textarea
            id="motivo"
            name="motivo"
            rows="3"
            value={consultaForm.motivo}
            onChange={(e) => setConsultaForm(prev => ({ ...prev, motivo: e.target.value }))}
            required
            className="p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 mt-1"
            placeholder="Ex: Vacinação anual, check-up de rotina, tosse persistente..."
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={!consultaForm.id_pet}
          className={`w-full mt-6 px-6 py-3 text-white font-bold rounded-lg transition duration-150 shadow-md ${
            !consultaForm.id_pet ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Agendar Consulta
        </button>
      </form>

      {/* Tabela de Consultas Agendadas */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Consultas Agendadas ({consultas.length})</h2>
        
        {/* Seção de Busca por Veterinário/Nome */}
          <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Buscar Consultas (por Veterinário):</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Digite o nome do veterinário para buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                autoComplete="off"
                aria-label="Buscar por Veterinário"
              />
              <button
                onClick={() => handleSearchConsultas(searchQuery)}
                type="button"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
              >
                Buscar
              </button>
              <button
                onClick={() => { setSearchQuery(''); fetchConsultas(); }}
                type="button"
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-150 shadow-md"
              >
                Limpar
              </button>
            </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Pet', 'Dono', 'Veterinário', 'Data', 'Hora', 'Motivo', 'Status', 'Ações'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultas.map((consulta) => (
                <tr key={consulta.id_consulta} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consulta.id_consulta}</td>
                  {/* Verifica se Pet existe antes de acessar propriedades (necessário por causa do `include` no controller do backend) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {consulta.Pet ? consulta.Pet.nome : `ID Pet: ${consulta.id_pet}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {consulta.Pet ? consulta.Pet.dono : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consulta.veterinario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(consulta.data)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consulta.hora}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{consulta.motivo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {consulta.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => handleDelete(consulta.id_consulta)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-1 rounded-md transition duration-150"
                      title="Deletar Consulta"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
              {consultas.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">Nenhuma consulta agendada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;