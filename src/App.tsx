import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import NovaDoacao from './pages/NovaDoacao'
import DoacaoDetalhe from './pages/DoacaoDetalhe'
import Painel from './pages/Painel'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Sobre from './pages/Sobre'
import Integrantes from './pages/Integrantes'
import IntegranteDetalhe from './pages/IntegranteDetalhe'
import Faq from './pages/Faq'
import Contato from './pages/Contato'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doacoes" element={<Catalogo />} />
        <Route path="/doacoes/:id" element={<DoacaoDetalhe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/integrantes/:rm" element={<IntegranteDetalhe />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />

        {/* Só doadores (e admin) publicam doações */}
        <Route element={<ProtectedRoute roles={['DOADOR', 'ADMIN']} />}>
          <Route path="/doacoes/nova" element={<NovaDoacao />} />
        </Route>

        {/* Qualquer usuário logado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/painel" element={<Painel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}