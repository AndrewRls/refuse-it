import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Building2, CalendarCheck, ChevronDown, CircleCheck, HeartHandshake, Leaf,
  PackageOpen, PackagePlus, Recycle, Scale, Search, ShieldCheck, Store, TrendingUp, Truck, Wheat,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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

interface Passo {
  icon: LucideIcon
  titulo: string
  texto: string
}

const atalhos = [
  { icon: PackagePlus, titulo: 'Publicar doação', foto: 'card-doar', to: '/doacoes/nova' },
  { icon: Search, titulo: 'Encontrar alimentos', foto: 'card-reservar', to: '/doacoes' },
  { icon: ShieldCheck, titulo: 'Manuseio seguro', foto: 'card-seguranca', to: '/faq' },
  { icon: Truck, titulo: 'Retirada rápida', foto: 'card-entrega', to: '/painel' },
]

const servicos = [
  { icon: PackagePlus, titulo: 'Publicação de doações', texto: 'Estabelecimentos informam quantidade, validade e prazo de retirada em poucos passos.' },
  { icon: CalendarCheck, titulo: 'Reserva de alimentos', texto: 'Instituições reservam só o que precisam, e a quantidade disponível se atualiza na hora.' },
  { icon: Truck, titulo: 'Entrega e retirada', texto: 'Agendamento e acompanhamento até a conclusão, com responsável definido.' },
  { icon: TrendingUp, titulo: 'Impacto medido', texto: 'O painel mostra quanto alimento foi reaproveitado, entrega por entrega.' },
]

const passos: Record<Perfil, Passo[]> = {
  doador: [
    { icon: Store, titulo: 'Cadastre seu estabelecimento', texto: 'Restaurantes, mercados, padarias e produtores entram em poucos minutos.' },
    { icon: PackagePlus, titulo: 'Publique o alimento', texto: 'Informe quantidade, validade, armazenamento e prazo de retirada.' },
    { icon: Truck, titulo: 'Acompanhe a entrega', texto: 'Aprove reservas e acompanhe a retirada ou entrega até o fim.' },
  ],
  instituicao: [
    { icon: HeartHandshake, titulo: 'Cadastre sua instituição', texto: 'ONGs, abrigos e cozinhas comunitárias podem participar.' },
    { icon: Search, titulo: 'Encontre alimentos', texto: 'Filtre por categoria, cidade e validade e escolha o que atende sua comunidade.' },
    { icon: CalendarCheck, titulo: 'Reserve e combine', texto: 'Solicite a quantidade que precisa e agende retirada ou entrega.' },
  ],
}

const cuidados = [
  'Apenas alimentos próprios para consumo, dentro da validade.',
  'Condição de armazenamento sempre informada ao publicar.',
  'Embalagens íntegras e alimentos higienizados.',
  'Prazo de retirada realista para a instituição buscar a tempo.',
]

const ods = [
  { numero: 2, icon: Wheat, titulo: 'Fome zero', texto: 'Alimento de qualidade chegando a quem tem dificuldade de acesso.' },
  { numero: 10, icon: Scale, titulo: 'Redução das desigualdades', texto: 'Conectamos quem tem sobra a quem tem falta.' },
  { numero: 11, icon: Building2, titulo: 'Cidades sustentáveis', texto: 'Menos resíduo orgânico nos aterros das cidades.' },
  { numero: 12, icon: Leaf, titulo: 'Consumo responsável', texto: 'Produção e consumo mais conscientes, sem desperdício.' },
]

function Servico({ icon: Icon, titulo, texto, invertido = false }: { icon: LucideIcon; titulo: string; texto: string; invertido?: boolean }) {
  return (
    <div className={`flex gap-4 ${invertido ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-ink">
        <Icon size={26} />
      </span>
      <div>
        <h3 className="text-lg text-white">{titulo}</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/75">{texto}</p>
      </div>
    </div>
  )
}

function Destaques() {
  const { data, loading, error, reload } = useFetch(carregarCatalogo)

  const lista = (data ?? [])
    .filter(podeReservar)
    .sort((a, b) => diasParaVencer(a.dataValidade) - diasParaVencer(b.dataValidade))
    .slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <SectionTitle
            eyebrow="Disponíveis agora"
            title="Doações em destaque"
            subtitle="Os alimentos que vencem primeiro aparecem aqui. Reserve antes que acabem."
          />
        </Reveal>
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
        <Foto nome="hero" alt="Pessoa separando alimentos frescos para doação" prioritaria className="absolute inset-0 -z-10 h-full w-full" />
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
            <Foto nome="hero-card" alt="Alimentos disponíveis para doação" className="h-full w-full transition duration-500 group-hover:scale-105" />
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
              <Link to={a.to} className="group relative block h-72 overflow-hidden rounded-3xl bg-brand-900 shadow-xl shadow-black/15">
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
              <Foto nome="sobre-1" alt="Feira com frutas e verduras frescas" className="absolute top-0 left-0 h-[420px] w-3/5 rounded-3xl" />
              <Foto nome="sobre-2" alt="Voluntária organizando caixas de alimentos" icon={HeartHandshake} className="absolute right-0 bottom-0 h-72 w-1/2 rounded-3xl ring-8 ring-white" />

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
            <SectionTitle
              eyebrow="Sobre nós"
              title="Transformando o descarte responsável em um futuro melhor"
              subtitle="Restaurantes, mercados e pequenos produtores descartam alimentos que ainda servem, enquanto comunidades inteiras enfrentam dificuldade de acesso à comida. Nós ligamos as duas pontas."
            />

            <div className="mt-8 flex items-center gap-4 rounded-full bg-white p-3 pr-6 ring-1 ring-brand-100">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Recycle size={26} />
              </span>
              <p className="text-sm font-bold text-brand-900">Comprometidos com a doação segura e sustentável</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button to="/sobre" seta>
                Saiba mais
              </Button>
              <Link to="/contato" className="text-sm font-bold text-brand-700 hover:text-brand-900">
                Fale com a equipe
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVIÇOS (fundo escuro) */}
      <section className="relative overflow-hidden bg-brand-900 py-24 text-white">
        <div aria-hidden="true" className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionTitle
              center
              claro
              eyebrow="O que fazemos"
              title="Tudo o que a doação precisa, em um só lugar"
            />
          </Reveal>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-10">
              <Reveal><Servico {...servicos[0]} /></Reveal>
              <Reveal delay={80}><Servico {...servicos[1]} /></Reveal>
            </div>

            <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
              <div aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-dashed border-brand-500/60 motion-safe:animate-spin-slow" />
              <div className="flex h-56 w-56 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                <Recycle size={110} className="text-brand-500" strokeWidth={1.25} />
              </div>
            </div>

            <div className="space-y-10">
              <Reveal><Servico {...servicos[2]} invertido /></Reveal>
              <Reveal delay={80}><Servico {...servicos[3]} invertido /></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* MANUSEIO SEGURO */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <Foto nome="seguranca" alt="Cozinha organizada com alimentos bem armazenados" icon={ShieldCheck} className="h-[440px] w-full rounded-3xl" />
              <div className="absolute -right-2 -bottom-6 hidden items-center gap-3 rounded-2xl bg-brand-900 p-4 text-white shadow-xl sm:flex">
                <ShieldCheck size={26} className="text-brand-500" />
                <p className="max-w-40 text-sm font-bold">Segurança alimentar em primeiro lugar</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <SectionTitle
              eyebrow="Segurança"
              title="Garantindo o manuseio seguro e a doação sustentável"
              subtitle="Doar bem é doar com cuidado. Estes são os princípios que a plataforma reforça em cada publicação."
            />
            <ul className="mt-8 space-y-3">
              {cuidados.map((c) => (
                <li key={c} className="flex gap-3 rounded-2xl bg-brand-50 p-4 text-sm font-semibold text-brand-900 ring-1 ring-brand-100">
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
          <SectionTitle center eyebrow="Passo a passo" title="Passos simples para uma doação que chega ao destino" />
        </Reveal>

        <div className="mt-10 flex justify-center">
          <div role="tablist" aria-label="Perfil" className="inline-flex rounded-full bg-brand-50 p-1.5 ring-1 ring-brand-100">
            {(['doador', 'instituicao'] as Perfil[]).map((p) => (
              <button
                key={p}
                role="tab"
                type="button"
                aria-selected={perfil === p}
                onClick={() => setPerfil(p)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  perfil === p ? 'bg-brand-700 text-white shadow-md' : 'text-brand-700 hover:text-brand-900'
                }`}
              >
                {p === 'doador' ? 'Sou doador' : 'Sou instituição'}
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" className="mt-16 grid gap-12 md:grid-cols-3">
          {passos[perfil].map((p, i) => (
            <div key={`${perfil}-${p.titulo}`} className="relative text-center">
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-brand-50 shadow-xl ring-8 ring-white shadow-brand-900/10">
                <p.icon size={44} className="text-brand-700" />
                <span className="absolute -top-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-sm font-extrabold text-white">
                  {i + 1}
                </span>
              </div>
              {i < 2 && <ArrowRight aria-hidden="true" size={28} className="absolute top-14 -right-9 hidden text-brand-500 md:block" />}
              <h3 className="mt-6 text-lg">{p.titulo}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/70">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAIXA COM FOTO */}
      <section className="relative isolate overflow-hidden py-28 text-white">
        <Foto nome="faixa" alt="Lavoura e feira com alimentos frescos" className="absolute inset-0 -z-10 h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-900/80" />
        <Reveal>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
            <p className="text-7xl font-extrabold text-brand-500">⅓</p>
            <h2 className="text-3xl text-white sm:text-4xl">
              Um terço de todo o alimento produzido no mundo é perdido ou desperdiçado
            </h2>
            <p className="max-w-2xl text-white/80">
              É o que aponta a FAO, o órgão da ONU para alimentação e agricultura. O Refuse It existe para devolver esse alimento a quem precisa.
            </p>
            <Button to="/doacoes" variant="accent" seta>
              Ver alimentos disponíveis
            </Button>
          </div>
        </Reveal>
      </section>

      {/* EQUIPE */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionTitle center eyebrow="Equipe" title="Conheça quem construiu o Refuse It" />
        </Reveal>

        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {integrantes.map((p, i) => (
            <Reveal key={p.rm} delay={(i % 3) * 80} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)]">
              <article className="flex h-full flex-col items-center rounded-3xl bg-white p-5 text-center ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10">
                <Avatar nome={p.nome} rm={p.rm} className="h-28 w-28 text-3xl" />
                <h3 className="mt-4 text-base">{p.nomeCurto}</h3>
                <p className="text-xs font-bold text-brand-700">{p.funcao}</p>
                <LinksSociais nome={p.nomeCurto} github={p.github} linkedin={p.linkedin} className="mt-4 justify-center" />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ODS */}
      <section className="bg-brand-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionTitle center eyebrow="Impacto" title="Conectado aos Objetivos de Desenvolvimento Sustentável" />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ods.map((o, i) => (
              <Reveal key={o.numero} delay={i * 80} className="h-full">
                <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-lg font-extrabold text-white">
                      {o.numero}
                    </span>
                    <o.icon size={22} className="text-brand-500" />
                  </div>
                  <h3 className="mt-4 text-base">{`ODS ${o.numero} · ${o.titulo}`}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{o.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionTitle eyebrow="Dúvidas" title="Perguntas frequentes" />
            <div className="mt-8 space-y-3">
              {perguntas.slice(0, 4).map((p, i) => {
                const aberta = faqAberta === i
                return (
                  <div key={p.pergunta} className="rounded-2xl bg-white ring-1 ring-brand-100">
                    <h3 className="text-base">
                      <button
                        type="button"
                        id={`home-faq-botao-${i}`}
                        aria-expanded={aberta}
                        aria-controls={`home-faq-painel-${i}`}
                        onClick={() => setFaqAberta(aberta ? null : i)}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left font-bold text-brand-900 transition hover:bg-brand-50"
                      >
                        {p.pergunta}
                        <ChevronDown size={20} className={`shrink-0 text-brand-700 transition-transform duration-300 ${aberta ? 'rotate-180' : ''}`} />
                      </button>
                    </h3>
                    <div
                      id={`home-faq-painel-${i}`}
                      role="region"
                      aria-labelledby={`home-faq-botao-${i}`}
                      className={`grid transition-all duration-300 ${aberta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{p.resposta}</p>
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
            <Foto nome="faq" alt="Voluntários em uma cozinha comunitária" icon={HeartHandshake} className="h-[460px] w-full rounded-3xl" />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-900 to-brand-700 px-6 py-14 text-white sm:px-12">
            <div aria-hidden="true" className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-3xl text-white sm:text-4xl">Pronto para recusar o desperdício?</h2>
                <p className="mt-3 max-w-xl text-white/80">
                  Publique um alimento que sobrou ou encontre o que sua comunidade precisa hoje.
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
          </div>
        </Reveal>
      </section>
    </>
  )
}