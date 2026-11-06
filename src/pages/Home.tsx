import { useState } from 'react'
import {
  ArrowRight, Ban, Building2, CalendarCheck, Clock, HeartHandshake, Leaf, MapPin,
  PackagePlus, Recycle, Repeat, Scale, Search, Sprout, Store, TrendingDown, Truck, Wheat,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'

type Perfil = 'doador' | 'instituicao'

interface Passo {
  icon: LucideIcon
  titulo: string
  texto: string
}

const passos: Record<Perfil, Passo[]> = {
  doador: [
    { icon: Store, titulo: 'Cadastre seu estabelecimento', texto: 'Restaurantes, mercados, padarias e produtores entram na plataforma em poucos minutos.' },
    { icon: PackagePlus, titulo: 'Publique o alimento', texto: 'Informe quantidade, validade, condição de armazenamento e prazo limite de retirada.' },
    { icon: Truck, titulo: 'Acompanhe a entrega', texto: 'Veja as reservas, aprove os pedidos e acompanhe a retirada ou entrega até a conclusão.' },
  ],
  instituicao: [
    { icon: HeartHandshake, titulo: 'Cadastre sua instituição', texto: 'ONGs, abrigos, cozinhas comunitárias e outras entidades sociais podem participar.' },
    { icon: Search, titulo: 'Encontre alimentos', texto: 'Filtre o catálogo por categoria, cidade e validade e escolha o que atende sua comunidade.' },
    { icon: CalendarCheck, titulo: 'Reserve e combine', texto: 'Solicite a quantidade que precisa e agende a retirada ou a entrega.' },
  ],
}

const cincoRs = [
  { icon: Ban, nome: 'Refuse', texto: 'Recuse o que você não precisa. É o primeiro passo e o mais poderoso.' },
  { icon: TrendingDown, nome: 'Reduce', texto: 'Reduza o que você consome e descarta.' },
  { icon: Repeat, nome: 'Reuse', texto: 'Reutilize antes de jogar fora.' },
  { icon: Recycle, nome: 'Recycle', texto: 'Recicle o que não dá para reaproveitar.' },
  { icon: Sprout, nome: 'Rot', texto: 'Composte a sobra orgânica e devolva nutrientes à terra.' },
]

const ods = [
  { numero: 2, icon: Wheat, titulo: 'Fome zero', texto: 'Alimento de qualidade chegando a quem tem dificuldade de acesso.' },
  { numero: 10, icon: Scale, titulo: 'Redução das desigualdades', texto: 'Conectamos quem tem sobra a quem tem falta.' },
  { numero: 11, icon: Building2, titulo: 'Cidades sustentáveis', texto: 'Menos resíduo orgânico nos aterros das cidades.' },
  { numero: 12, icon: Leaf, titulo: 'Consumo responsável', texto: 'Produção e consumo mais conscientes, sem desperdício.' },
]

export default function Home() {
  const [perfil, setPerfil] = useState<Perfil>('doador')

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50 to-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
              <Leaf size={14} /> Plataforma de redistribuição de alimentos
            </span>

            <h1 className="mt-6 text-4xl leading-tight font-extrabold sm:text-5xl lg:text-6xl">
              Diga não ao{' '}
              <span className="bg-linear-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">lixo.</span>
              <br />
              Diga sim a quem precisa.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              O Refuse It conecta estabelecimentos, produtores e instituições sociais para que
              alimentos próprios para consumo cheguem à mesa, e não ao descarte.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/doacoes">
                Ver alimentos disponíveis <ArrowRight size={18} />
              </Button>
              <Button to="/doacoes/nova" variant="secondary">
                Quero doar
              </Button>
            </div>
          </div>

          {/* Card ilustrativo */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="motion-safe:animate-float rounded-3xl bg-white p-6 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-900">Disponível</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-ink/60">
                  <Clock size={14} /> vence em 2 dias
                </span>
              </div>
              <h3 className="mt-4 text-xl">Pães frescos do dia</h3>
              <p className="mt-1 text-sm text-ink/60">Padaria Exemplo · São Paulo, SP</p>

              <div className="mt-5">
                <div className="mb-1 flex justify-between text-xs font-semibold text-ink/70">
                  <span>12 kg disponíveis</span>
                  <span>de 20 kg</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-brand-100">
                  <div className="h-full w-3/5 rounded-full bg-linear-to-r from-brand-500 to-brand-700" />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-brand-700">
                <MapPin size={16} /> Retirada até 18h
              </div>
            </div>

            <div className="absolute -bottom-6 -left-2 hidden rounded-2xl bg-brand-900 p-4 text-white shadow-xl sm:block">
              <p className="text-xs text-brand-100">Reserva aprovada</p>
              <p className="text-sm font-bold">Instituição Esperança</p>
            </div>

            <p className="mt-8 text-center text-xs text-ink/50 sm:mt-10">Exemplo ilustrativo</p>
          </div>
        </div>
      </section>

      {/* FAIXA DO PROBLEMA */}
      <section className="bg-brand-900 text-white">
        <Reveal>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:flex-row md:text-left">
            <p className="text-6xl font-extrabold text-brand-500">⅓</p>
            <p className="max-w-3xl text-lg leading-relaxed text-brand-100">
              Cerca de um terço de todo o alimento produzido no mundo é perdido ou desperdiçado,
              segundo a FAO. O Refuse It existe para devolver esse alimento a quem precisa.
            </p>
          </div>
        </Reveal>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionTitle
            center
            eyebrow="Como funciona"
            title="Simples para quem doa e para quem recebe"
            subtitle="Escolha seu perfil e veja o caminho do alimento até a mesa."
          />
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

        <div role="tabpanel" className="mt-12 grid gap-6 md:grid-cols-3">
          {passos[perfil].map((passo, i) => (
            <div
              key={`${perfil}-${passo.titulo}`}
              className="group rounded-3xl bg-white p-7 ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
                  <passo.icon size={24} />
                </span>
                <span className="text-4xl font-extrabold text-brand-100">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg">{passo.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{passo.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 Rs */}
      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionTitle
              eyebrow="Zero waste"
              title="Tudo começa com o Refuse"
              subtitle="“Refuse” é o primeiro dos 5 Rs do estilo de vida zero waste. Antes de reciclar, antes de reaproveitar, aprendemos a dizer não ao que não precisa."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {cincoRs.map((r, i) => (
              <Reveal key={r.nome} delay={i * 80}>
                <div
                  className={`h-full rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 ${
                    i === 0
                      ? 'bg-linear-to-br from-brand-900 to-brand-700 text-white shadow-xl shadow-brand-900/20'
                      : 'bg-white ring-1 ring-brand-100 hover:shadow-lg'
                  }`}
                >
                  <r.icon size={28} className={i === 0 ? 'text-brand-100' : 'text-brand-700'} />
                  <h3 className={`mt-4 text-xl ${i === 0 ? 'text-white' : ''}`}>{r.nome}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${i === 0 ? 'text-brand-100' : 'text-ink/70'}`}>{r.texto}</p>
                  {i === 0 && (
                    <span className="mt-4 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold">É aqui que começamos</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ODS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionTitle
            center
            eyebrow="Impacto"
            title="Conectado aos Objetivos de Desenvolvimento Sustentável"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ods.map((o, i) => (
            <Reveal key={o.numero} delay={i * 80}>
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
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-900 to-brand-700 px-6 py-14 text-center text-white sm:px-12">
            <div aria-hidden="true" className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-3xl text-white sm:text-4xl">Pronto para recusar o desperdício?</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-brand-100">
              Publique um alimento que sobrou ou encontre o que sua comunidade precisa hoje.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/doacoes/nova" variant="secondary">Publicar uma doação</Button>
              <Button to="/doacoes" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Explorar o catálogo <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}