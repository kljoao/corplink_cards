import React, { useState, useEffect } from "react"
import type { ComponentType } from "react"
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"
import { useGlobalStore } from "./store.ts"
import ButtonForm from "https://framer.com/m/button-form-MflT.js@0zNm5hC1gURlpKY6OzUF"

const useStore = createStore({})
const MAX_COMPANY_LENGTH = 20
const ITEMS_PER_PAGE = 45

const buttonStyle = {
    cursor: "pointer",
    alignSelf: "center",
    transform: "scale(0.88)",
    margin: "2px 4px",
}

const skeletonKeyframes = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`

if (
    typeof document !== "undefined" &&
    !document.getElementById("skeleton-keyframes")
) {
    const style = document.createElement("style")
    style.id = "skeleton-keyframes"
    style.innerHTML = skeletonKeyframes
    document.head.appendChild(style)
}

const skeletonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #222 25%, #2a2a2a 37%, #222 63%)",
    backgroundSize: "400% 100%",
    borderRadius: 8,
    animation: "shimmer 1.2s ease-in-out infinite",
}

const borderLarge: React.CSSProperties = {
    borderWidth: "2px",
}

const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "12px",
    maxWidth: "1140px",
    justifyContent: "center",
}

function SkeletonCard() {
    return (
        <div
            style={{
                ...borderLarge,
                width: 240,
                borderRadius: 12,
                overflow: "hidden",
            }}
        >
            <div style={{ ...skeletonStyle, height: 160 }} />
            <div style={{ padding: 16 }}>
                <div
                    style={{
                        ...skeletonStyle,
                        height: 20,
                        width: "60%",
                        marginBottom: 8,
                    }}
                />
                <div
                    style={{
                        ...skeletonStyle,
                        height: 16,
                        width: "40%",
                        marginBottom: 4,
                    }}
                />
                <div
                    style={{
                        ...skeletonStyle,
                        height: 16,
                        width: "50%",
                        marginBottom: 12,
                    }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...skeletonStyle,
                                height: 24,
                                width: 24,
                                borderRadius: "50%",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function getListMembers(Component): ComponentType {
    if (!Component) {
        console.warn("Nenhum componente recebido no getListMembers")
        return () => <div>⚠ Override não vinculado corretamente ⚠</div>
    }

    return (props) => {
        console.log("getListMembers override está rodando no Framer")

        const [store, setStore] = useGlobalStore()
        const searchTerm = String(store.searchTerm ?? "")
        const setSearchTerm = (v: string) => setStore({ searchTerm: v })

        const [members, setMembers] = useState<any[]>([])
        const [nextLink, setNextLink] = useState()
        const [prevLink, setPrevLink] = useState()
        const [loading, setLoading] = useState(true)
        const [isSearchDisabled, setIsSearchDisabled] = useState(true)
        const [currentPage, setCurrentPage] = useState(0)
        const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })

        // Função para mostrar toast
        const showToast = (message: string) => {
            setToast({ message, visible: true })
            setTimeout(() => {
                setToast({ message: '', visible: false })
            }, 3000)
        }

        useEffect(() => {
            setIsSearchDisabled(true)
            setSearchTerm("")
            setCurrentPage(0)
            const timer = setTimeout(() => setIsSearchDisabled(false), 2000)
            return () => clearTimeout(timer)
        }, [])

        useEffect(() => {
            if (isSearchDisabled) return

            const termoSeguro = searchTerm.trim()

            if (termoSeguro !== "") {
                const fetchSearch = async () => {
                    setLoading(true)
                    try {
                        const token = localStorage.getItem("token")
                        const url = `https://admin.corplink.co/api/v1/users/search?search=${encodeURIComponent(termoSeguro)}`
                        const response = await fetch(url, {
                            method: "GET",
                            headers: {
                                accept: "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        const data = await response.json()
                        setMembers(Array.isArray(data) ? data : [])
                        setNextLink(null)
                        setPrevLink(null)
                    } catch (error) {
                        console.error(
                            "Erro ao buscar membros por pesquisa:",
                            error
                        )
                        setMembers([])
                    } finally {
                        setLoading(false)
                    }
                }
                fetchSearch()
            } else {
                fetchAllMembers(null)
            }
        }, [searchTerm, isSearchDisabled])

        const fetchAllMembers = async (urlNav) => {
            setLoading(true)
            try {
                const token = localStorage.getItem("token")
                const url = urlNav ?? `https://admin.corplink.co/api/v1/users`
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                const data = await response.json()
                const nextButtonLink = data.next_page_url ?? data.last_page_url
                const prevButtonLink = data.prev_page_url ?? data.first_page_url
                const items = data.data || []
                setMembers(items)
                setNextLink(nextButtonLink)
                setPrevLink(prevButtonLink)
            } catch (error) {
                console.error("Erro ao buscar membros paginados:", error)
            } finally {
                setLoading(false)
            }
        }

        const termo = !isSearchDisabled ? searchTerm.trim().toLowerCase() : ""

        const handleNoWhatsapp = () => {
            showToast("O contato do usuário não está disponível")
        }

        const filteredMembers = termo
            ? members.filter((member) => {
                  const nome = String(member.firstname || "").toLowerCase()
                  const cargo = String(
                      member.info?.occupation || ""
                  ).toLowerCase()
                  const empresa = String(
                      member.info?.company || ""
                  ).toLowerCase()
                  const segmento = String(
                      member.info?.sector || ""
                  ).toLowerCase()
                  return (
                      nome.includes(termo) ||
                      cargo.includes(termo) ||
                      empresa.includes(termo) ||
                      segmento.includes(termo)
                  )
              })
            : members

        const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
        const safeCurrentPage = Math.min(currentPage, totalPages - 1)
        const startIndex = safeCurrentPage * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        const paginatedMembers = filteredMembers.slice(startIndex, endIndex)

        if (loading) {
            return (
                <div style={containerStyle}>
                    {[...Array(4)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )
        }

        if (filteredMembers.length === 0) {
            return <div>Nenhum membro encontrado.</div>
        }

        return (
            <>
                <div style={containerStyle}>
                    {paginatedMembers.map((member) => {
                        try {
                            const rawCompany = member.info?.company || ""
                            const empresa =
                                rawCompany.length > MAX_COMPANY_LENGTH
                                    ? rawCompany.slice(0, MAX_COMPANY_LENGTH) +
                                      "..."
                                    : rawCompany

                            return (
                                <Component
                                    key={member.id}
                                    {...props}
                                    avatar={
                                        member.avatar_thumb || member.avatar
                                    }
                                    title={`${member.firstname ?? ""} ${member.lastname ?? ""}`.trim()}
                                    empresa={empresa}
                                    cargo={member.info?.occupation || ""}
                                    segmento={member.info?.sector || ""}
                                    instagram={
                                        member.info?.social_links?.instagram
                                            ? `https://instagram.com/${member.info?.social_links?.instagram}`
                                            : ""
                                    }
                                    linkedin={
                                        member.info?.social_links?.linkedin
                                            ? `https://www.linkedin.com/in/${member.info?.social_links?.linkedin}`
                                            : ""
                                    }
                                    whatsapp={
                                        member.info?.phone_prefix &&
                                        member.info?.phone &&
                                        String(member.info?.social_links?.whatsapp) === '1'
                                            ? `https://wa.me/${member.info.phone_prefix}${member.info.phone}`
                                            : ""
                                    }
                                    whatsappAvailable={
                                        member.info?.phone_prefix &&
                                        member.info?.phone &&
                                        String(member.info?.social_links?.whatsapp) === '1'
                                    }
                                    onWhatsappClick={handleNoWhatsapp}
                                    style={{ ...borderLarge }}
                                    id={member.id}
                                />
                            )
                        } catch (e) {
                            console.warn(
                                "Erro ao renderizar membro:",
                                member,
                                e
                            )
                            return null
                        }
                    })}
                </div>

                <div
                    style={{
                        marginTop: 30,
                        display: "flex",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <ButtonForm
                        title="<-Anterior"
                        style={buttonStyle}
                        onClick={() => {
                            fetchAllMembers(prevLink)
                            window.scrollTo({ top: 0 })
                        }}
                    />
                    <ButtonForm
                        title="Próxima->"
                        style={buttonStyle}
                        onClick={() => {
                            fetchAllMembers(nextLink)
                            window.scrollTo({ top: 0 })
                        }}
                    />
                </div>

                {/* Toast Component */}
                {toast.visible && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            backgroundColor: '#1f2937',
                            color: '#f3f4f6',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            border: '1px solid #374151',
                            maxWidth: '300px',
                            fontSize: '14px',
                        }}
                    >
                        {toast.message}
                    </div>
                )}
            </>
        )
    }
}
