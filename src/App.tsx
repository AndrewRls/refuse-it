import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import NovaDoacao from './pages/NovaDoacao'
import DoacaoDetalhe from './pages/DoacaoDetalhe'
import Painel from './pages/Painel'
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
        <Route path="/doacoes/nova" element={<NovaDoacao />} />
        <Route path="/doacoes/:id" element={<DoacaoDetalhe />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/integrantes/:rm" element={<IntegranteDetalhe />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}