import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, ChevronDown, CircleCheck, HeartHandshake, Leaf, PackageOpen, PackagePlus, Search, ShieldCheck, Truck,
} from 'lucide-react'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import DoacaoCard from '../components/DoacaoCard'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Foto from '../components/Foto'
import LinksSociais from '../components/LinksSociais'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import Spinner from '../components/Spinner'
import { integrantes } from '../data/integrantes'
import { perguntas } from '../data/faq'
import { useFetch } from '../hooks/useFetch'
import { carregarCatalogo } from '../services/catalogoService'
import { podeReservar } from '../utils/doacao'
import { diasParaVencer } from '../utils/format'

type Perfil = 'doador' | 'instituicao'

const atalhos = [
  { icon: PackagePlus, titulo: 'Publicar doação', foto: ['card-doar', 'foto-1'], to: '/doacoes/nova' },
  { icon: Search, titulo: 'Encontrar alimentos', foto: ['card-reservar', 'foto-2'], to: '/doacoes' },
  { icon: ShieldCheck, titulo: 'Manuseio seguro', foto: ['card-seguranca', 'foto-3'], to: '/faq' },
  { icon: Truck, titulo: 'Retirada rápida', foto: ['card-entrega', 'foto-4'], to: '/painel' },
]

const etapas = [
  {
    titulo: 'Publicação',
    texto: 'O estabelecimento escolhe o alimento e informa a quantidade, a validade, como armazenar e até quando dá para retirar.',
  },
  {
    titulo: 'Reserva',
    texto: 'A instituição escolhe quanto precisa e faz o pedido. O doador analisa e aprova ou recusa.',
  },
  {
    titulo: 'Entrega ou retirada',
    texto: 'Com o pedido aprovado, o doador agenda dia e horário e define quem leva ou quem busca.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'O painel mostra reservas, entregas e o total de alimento que foi realmente reaproveitado.',
  },
]

const passos: Record<Perfil, { titulo: string; texto: string }[]> = {
  doador: [
    { titulo: 'Cadastre o estabelecimento', texto: 'Restaurante, mercado, padaria ou produtor. O cadastro leva poucos minutos.' },
    { titulo: 'Publique o que sobrou', texto: 'Informe quantidade, validade, armazenamento e prazo de retirada.' },
    { titulo: 'Acompanhe a entrega', texto: 'Aprove os pedidos e acompanhe a retirada ou entrega até o fim.' },
  ],
  instituicao: [
    { titulo: 'Cadastre a instituição', texto: 'ONGs, abrigos e cozinhas comunitárias podem participar.' },
    { titulo: 'Escolha os alimentos', texto: 'Filtre por categoria, cidade e validade e veja o que atende sua comunidade.' },
    { titulo: 'Reserve e combine a retirada', texto: 'Peça a quantidade que precisa e agende retirada ou entrega.' },
  ],
}

const cuidados = [
  'Apenas alimentos próprios para consumo, dentro da validade.',
  'Condição de armazenamento sempre informada ao publicar.',
  'Embalagens íntegras e alimentos higienizados.',
  'Prazo de retirada realista, para a instituição buscar a tempo.',
]

const ods = [
  { numero: '2', titulo: 'Fome zero', texto: 'Alimento chegando a quem tem dificuldade de acesso.' },
  { numero: '10', titulo: 'Redução das desigualdades', texto: 'Quem tem sobra e quem tem falta no mesmo lugar.' },
  { numero: '11', titulo: 'Cidades sustentáveis', texto: 'Menos resíduo orgânico indo para o aterro.' },
  { numero: '12', titulo: 'Consumo responsável', texto: 'Aproveitar o que já foi produzido.' },
]

function Destaques() {
  const { data, loading, error, reload } = useFetch(carregarCatalogo)

  const lista = (data ?? [])
    .filter(podeReservar)
    .sort((a, b) => diasParaVencer(a.dataValidade) - diasParaVencer(b.dataValidade))
    .slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Disponíveis agora"
          title="Doações em destaque"
          subtitle="Os alimentos que vencem primeiro aparecem aqui. Reserve antes que acabem."
        />
        <Button to="/doacoes" variant="secondary" seta>
          Ver todas
        </Button>
      </div>

      <div className="mt-10">
        {loading && <Spinner texto="Buscando doações..." />}
        {!loading && error && <ErrorMessage mensagem={error} onRetry={reload} />}
        {!loading && !error && lista.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            titulo="Nenhuma doação disponível no momento"
            texto="Seja o primeiro a publicar um alimento e ajude a reduzir o desperdício."
            action={<Button to="/doacoes/nova">Publicar uma doação</Button>}
          />
        )}
        {!loading && !error && lista.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((d, i) => (
              <Reveal key={d.idDoacao} delay={i * 80} className="h-full">
                <DoacaoCard doacao={d} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const [perfil, setPerfil] = useState<Perfil>('doador')
  const [faqAberta, setFaqAberta] = useState<number | null>(0)

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-brand-900 text-white lg:min-h-[740px]">
        <Foto nome={['hero', 'foto-1']} alt="Pessoa separando alimentos frescos para doação" prioritaria className="absolute inset-0 -z-10 h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/45 to-black/10" />

        <div className="mx-auto grid w-full max-w-7xl items-end gap-10 px-4 pt-40 pb-44 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight text-white uppercase sm:text-6xl lg:text-7xl">
              Diga não ao <span className="text-brand-500">desperdício</span>
            </h1>

            <div className="mt-8 flex max-w-xl items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                <Leaf size={22} />
              </span>
              <p className="text-base leading-relaxed text-white/90">
                O Refuse It conecta estabelecimentos, produtores e instituições sociais para que alimentos próprios para
                consumo cheguem à mesa, e não ao lixo.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/doacoes" variant="accent" seta>
                Ver alimentos
              </Button>
              <Button to="/doacoes/nova" variant="secondary">
                Quero doar
              </Button>
            </div>
          </div>

          <Link to="/doacoes" className="group relative hidden h-52 overflow-hidden rounded-3xl ring-1 ring-white/30 lg:block">
            <Foto nome={['hero-card', 'foto-6']} alt="Alimentos disponíveis para doação" className="h-full w-full transition duration-500 group-hover:scale-105" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
              <p className="max-w-40 text-sm font-bold text-white">Alimentos disponíveis agora</p>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-ink transition group-hover:bg-white">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ATALHOS */}
      <section className="relative z-10 mx-auto -mt-28 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {atalhos.map((a, i) => (
            <Reveal key={a.titulo} delay={i * 80} className="h-full">
              <Link to={a.to} className="group relative block h-72 overflow-hidden rounded-3xl bg-brand-900 shadow-lg shadow-black/20">
                <Foto nome={a.foto} alt="" icon={a.icon} className="h-full w-full transition duration-500 group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <p className="absolute bottom-5 left-5 max-w-36 text-lg leading-tight font-bold text-white">{a.titulo}</p>
                <span className="absolute right-0 bottom-0 flex h-16 w-16 items-center justify-center rounded-tl-3xl bg-brand-500 text-ink transition group-hover:bg-white">
                  <a.icon size={26} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto h-[500px] w-full max-w-lg">
              <Foto nome={['sobre-1', 'foto-5']} alt="Feira com frutas e verduras frescas" className="absolute top-0 left-0 h-[420px] w-3/5 rounded-3xl" />
              <Foto nome={['sobre-2', 'foto-6']} alt="Voluntária organizando caixas de alimentos" icon={HeartHandshake} className="absolute right-0 bottom-0 h-72 w-1/2 rounded-3xl ring-8 ring-white" />

              <div className="absolute top-[58%] left-[38%] z-10 flex h-36 w-36 items-center justify-center rounded-full bg-brand-900 text-white shadow-xl ring-8 ring-white">
                <svg viewBox="0 0 120 120" className="absolute inset-0 motion-safe:animate-spin-slow" aria-hidden="true">
                  <defs>
                    <path id="circulo-rs" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                  </defs>
                  <text fill="currentColor" fontSize="8" fontWeight="700">
                    <textPath href="#circulo-rs" textLength="283" lengthAdjust="spacing">
                      REFUSE · REDUCE · REUSE · RECYCLE · ROT ·
                    </textPath>
                  </text>
                </svg>
                <div className="text-center">
                  <p className="text-4xl leading-none font-extrabold">1º</p>
                  <p className="mt-1 text-[10px] font-bold uppercase">R do zero waste</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <SectionTitle eyebrow="Sobre nós" title="Comida boa não deveria ir para o lixo" />
            <p className="mt-5 leading-relaxed text-ink/70">
              Padarias, mercados e produtores jogam fora, todo dia, alimento que ainda está bom. Do outro lado, cozinhas
              comunitárias e abrigos têm dificuldade para comprar comida. O Refuse It coloca os dois no mesmo lugar: quem
              tem sobra publica, quem precisa reserva e retira.
            </p>
            <p className="mt-6 border-l-4 border-brand-500 pl-4 text-sm font-semibold text-brand-900">
              O primeiro dos 5 Rs do zero waste é recusar. Daí vem o nome.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button to="/sobre" seta>
                Conheça o projeto
              </Button>
              <Link to="/contato" className="text-sm font-bold text-brand-700 hover:text-brand-900">
                Fale com a equipe
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMO FUNCIONA (fundo escuro) */}
      <section className="bg-brand-900 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <Foto nome={['servicos', 'foto-3']} alt="Voluntários separando alimentos em caixas" icon={PackagePlus} className="h-[520px] w-full rounded-3xl" />
          </Reveal>

          <Reveal delay={100}>
            <SectionTitle claro eyebrow="Como funciona" title="O caminho do alimento, na prática" />
            <ol className="mt-8">
              {etapas.map((e, i) => (
                <li key={e.titulo} className="flex gap-6 border-t border-white/15 py-6">
                  <span className="w-12 shrink-0 text-3xl font-extrabold text-brand-500">0{i + 1}</span>
                  <div>
                    <h3 className="text-lg text-white">{e.titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/75">{e.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* MANUSEIO SEGURO */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <Foto nome={['seguranca', 'foto-2']} alt="Cozinha organizada com alimentos bem armazenados" icon={ShieldCheck} className="h-[440px] w-full rounded-3xl" />
          </Reveal>

          <Reveal delay={100}>
            <SectionTitle
              eyebrow="Segurança alimentar"
              title="Doar com segurança"
              subtitle="Doar bem é doar com cuidado. Estes são os pontos que a plataforma pede a cada publicação."
            />
            <ul className="mt-8">
              {cuidados.map((c) => (
                <li key={c} className="flex gap-3 border-b border-brand-100 py-4 text-sm font-semibold text-brand-900">
                  <CircleCheck size={20} className="mt-0.5 shrink-0 text-brand-700" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button to="/faq" seta>
                Ver orientações
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DOAÇÕES EM DESTAQUE (dados da API) */}
      <div className="bg-brand-50">
        <Destaques />
      </div>

      {/* PASSOS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionTitle eyebrow="Passo a passo" title="Da publicação à retirada, em três passos" />
        </Reveal>

        <div role="tablist" aria-label="Perfil" className="mt-8 flex gap-8 border-b border-brand-100">
          {(['doador', 'instituicao'] as Perfil[]).map((p) => (
            <button
              key={p}
              role="tab"
              type="button"
              aria-selected={perfil === p}
              onClick={() => setPerfil(p)}
              className={`-mb-px border-b-2 pb-3 text-sm font-bold transition ${
                perfil === p ? 'border-brand-700 text-brand-900' : 'border-transparent text-ink/50 hover:text-brand-700'
              }`}
            >
              {p === 'doador' ? 'Sou doador' : 'Sou instituição'}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-12 grid gap-10 md:grid-cols-3">
          {passos[perfil].map((p, i) => (
            <div key={`${perfil}-${p.titulo}`} className="border-t-2 border-brand-700 pt-6">
              <p className="text-5xl font-extrabold text-brand-100">0{i + 1}</p>
              <h3 className="mt-3 text-lg">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAIXA COM FOTO */}
      <section className="relative isolate overflow-hidden py-28 text-white">
        <Foto nome={['faixa', 'foto-5']} alt="Lavoura e feira com alimentos frescos" className="absolute inset-0 -z-10 h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-900/80" />
        <Reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-7xl font-extrabold text-brand-500">⅓</p>
            <h2 className="mt-4 max-w-3xl text-3xl text-white sm:text-4xl">
              Cerca de um terço de todo o alimento produzido no mundo é perdido ou desperdiçado
            </h2>
            <p className="mt-4 max-w-2xl text-white/80">
              O dado é da FAO, o órgão da ONU para alimentação e agricultura. O Refuse It existe para devolver parte desse alimento a quem precisa.
            </p>
            <div className="mt-8">
              <Button to="/doacoes" variant="accent" seta>
                Ver alimentos disponíveis
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* EQUIPE */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionTitle eyebrow="Equipe" title="Quem fez o projeto" />
        </Reveal>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {integrantes.map((p, i) => (
            <Reveal key={p.rm} delay={(i % 3) * 80}>
              <article>
                <Avatar retrato nome={p.nome} rm={p.rm} />
                <h3 className="mt-4 text-base">{p.nomeCurto}</h3>
                <p className="text-xs font-bold text-brand-700">{p.funcao}</p>
                <LinksSociais nome={p.nomeCurto} github={p.github} linkedin={p.linkedin} className="mt-3" />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ODS */}
      <section className="bg-brand-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionTitle eyebrow="ODS" title="Objetivos de Desenvolvimento Sustentável" />
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ods.map((o, i) => (
              <Reveal key={o.numero} delay={i * 80}>
                <div className="border-l-2 border-brand-500 pl-5">
                  <p className="text-5xl font-extrabold text-brand-700">{o.numero}</p>
                  <h3 className="mt-2 text-base">{o.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{o.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DÚVIDAS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionTitle eyebrow="Dúvidas" title="Dúvidas comuns" />
            <div className="mt-8 border-t border-brand-100">
              {perguntas.slice(0, 4).map((p, i) => {
                const aberta = faqAberta === i
                return (
                  <div key={p.pergunta} className="border-b border-brand-100">
                    <h3 className="text-base">
                      <button
                        type="button"
                        id={`home-faq-botao-${i}`}
                        aria-expanded={aberta}
                        aria-controls={`home-faq-painel-${i}`}
                        onClick={() => setFaqAberta(aberta ? null : i)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left font-bold text-brand-900 transition hover:text-brand-700"
                      >
                        {p.pergunta}
                        <ChevronDown size={20} className={`shrink-0 transition-transform duration-300 ${aberta ? 'rotate-180' : ''}`} />
                      </button>
                    </h3>
                    <div
                      id={`home-faq-painel-${i}`}
                      role="region"
                      aria-labelledby={`home-faq-botao-${i}`}
                      className={`grid transition-all duration-300 ${aberta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-5 text-sm leading-relaxed text-ink/70">{p.resposta}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <Button to="/faq" variant="secondary" seta>
                Ver todas as perguntas
              </Button>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Foto nome={['faq', 'foto-4']} alt="Voluntários em uma cozinha comunitária" icon={HeartHandshake} className="h-[460px] w-full rounded-3xl" />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-brand-900 px-6 py-12 text-white sm:px-12 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl text-white sm:text-4xl">Tem comida sobrando ou precisando de comida?</h2>
              <p className="mt-3 max-w-xl text-white/80">
                Publique um alimento ou encontre o que sua comunidade precisa hoje.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/doacoes/nova" variant="accent" seta>
                Publicar uma doação
              </Button>
              <Button to="/cadastro" variant="secondary">
                Criar conta
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}