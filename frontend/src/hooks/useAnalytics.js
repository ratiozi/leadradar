import { useState, useEffect } from 'react'

const API_BASE = '/api'

export function useAnalytics() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const formatDate = (daysAgo) => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().split('T')[0]
  }

  const fetch = async (endpoint, params = {}) => {
    setLoading(true)
    setError(null)
    
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_BASE}${endpoint}${queryString ? `?${queryString}` : ''}`
    
    try {
      const response = await fetch(url)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Request failed')
      }
      
      return data.data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getSummary = (from, to) => fetch('/analytics/summary', { from, to })
  const getGrowth = (from, to) => fetch('/analytics/growth', { from, to })
  const getTrends = (granularity, from, to) => fetch('/analytics/trends', { granularity, from, to })
  const getSources = (from, to) => fetch('/analytics/sources', { from, to })
  const getUTM = (from, to) => fetch('/analytics/utm', { from, to })
  const getTeam = (from, to) => fetch('/analytics/team', { from, to })
  const getAvgCloseTime = (from, to) => fetch('/analytics/avg-close-time', { from, to })
  const getTimeOfDay = (from, to) => fetch('/analytics/time-of-day', { from, to })
  const getNewVsProcessed = (from, to) => fetch('/analytics/new-vs-processed', { from, to })
  const getRecentLeads = () => fetch('/leads/recent')
  const searchLeads = (query) => fetch('/leads/search', { q: query })

  return {
    loading,
    error,
    formatDate,
    getSummary,
    getGrowth,
    getTrends,
    getSources,
    getUTM,
    getTeam,
    getAvgCloseTime,
    getTimeOfDay,
    getNewVsProcessed,
    getRecentLeads,
    searchLeads
  }
}
