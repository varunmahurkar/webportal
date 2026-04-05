/**
 * Live Data Widget — inline real-time data cards rendered inside markdown responses.
 * Triggered by [[LIVE:type:symbol]] markers in synthesised LLM output.
 * Fetches fresh data client-side from /data/live endpoint.
 * Supports: stock prices, crypto prices, weather conditions.
 * Connected to: MarkdownRenderer (marker detection → renders this component).
 */

'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Flex, Box } from '@/app/core/Grid';
import { Text } from '@/app/core/Typography';
import { TrendingUp, TrendingDown, Cloud, Bitcoin, BarChart2 } from '@/app/core/icons';
import styles from './LiveDataWidget.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type LiveDataType = 'stock' | 'crypto' | 'weather';

interface LiveDataWidgetProps {
  /** Data type — "stock" | "crypto" | "weather" */
  type: LiveDataType;
  /** Ticker, coin id, or city name */
  symbol: string;
  className?: string;
}

interface LiveData {
  type: string;
  symbol: string;
  data: Record<string, any>;
  source: string;
}

/**
 * Fetch live data from the backend /data/live endpoint.
 */
async function fetchLiveData(type: LiveDataType, symbol: string): Promise<LiveData> {
  const url = `${API_URL}/data/live?type=${encodeURIComponent(type)}&symbol=${encodeURIComponent(symbol)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Live data fetch failed: ${res.status}`);
  return res.json();
}

/**
 * Stock widget — price + change %
 */
const StockWidget: React.FC<{ data: Record<string, any>; symbol: string }> = ({ data, symbol }) => {
  const isPositive = (data.change_pct ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? styles.positive : styles.negative;

  return (
    <Flex className={styles.widgetInner} alignItems="center" gap={3}>
      <Box className={styles.widgetIcon}>
        <BarChart2 size={18} />
      </Box>
      <Box className={styles.widgetData}>
        <Text variant="label-sm" weight={700} className={styles.symbol}>{symbol}</Text>
        <Text variant="heading-sm" weight={700}>
          {data.price ? `$${data.price.toLocaleString()}` : '—'}
          {' '}
          <span className={styles.currency}>{data.currency || 'USD'}</span>
        </Text>
        {data.change_pct !== null && data.change_pct !== undefined && (
          <Flex alignItems="center" gap={1} className={cn(styles.change, trendColor)}>
            <TrendIcon size={12} />
            <span>{data.change_pct > 0 ? '+' : ''}{data.change_pct.toFixed(2)}%</span>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

/**
 * Crypto widget — USD price + 24h change
 */
const CryptoWidget: React.FC<{ data: Record<string, any>; symbol: string }> = ({ data, symbol }) => {
  const change = data.change_24h_pct ?? 0;
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Flex className={styles.widgetInner} alignItems="center" gap={3}>
      <Box className={styles.widgetIcon}>
        <Bitcoin size={18} />
      </Box>
      <Box className={styles.widgetData}>
        <Text variant="label-sm" weight={700} className={styles.symbol}>{symbol.toUpperCase()}</Text>
        <Text variant="heading-sm" weight={700}>
          {data.price_usd ? `$${data.price_usd.toLocaleString()}` : '—'}
        </Text>
        {change !== 0 && (
          <Flex alignItems="center" gap={1} className={cn(styles.change, isPositive ? styles.positive : styles.negative)}>
            <TrendIcon size={12} />
            <span>{change > 0 ? '+' : ''}{change.toFixed(2)}% 24h</span>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

/**
 * Weather widget — temperature + condition
 */
const WeatherWidget: React.FC<{ data: Record<string, any>; symbol: string }> = ({ data, symbol }) => (
  <Flex className={styles.widgetInner} alignItems="center" gap={3}>
    <Box className={styles.widgetIcon}>
      <Cloud size={18} />
    </Box>
    <Box className={styles.widgetData}>
      <Text variant="label-sm" weight={700} className={styles.symbol}>{data.location || symbol}</Text>
      <Text variant="heading-sm" weight={700}>
        {data.temperature_c !== undefined ? `${data.temperature_c}°C` : '—'}
      </Text>
      <Text variant="caption" color="secondary">{data.condition || ''}</Text>
      {data.humidity_pct && (
        <Text variant="caption" color="tertiary">Humidity: {data.humidity_pct}%</Text>
      )}
    </Box>
  </Flex>
);

/**
 * LiveDataWidget — fetches and renders real-time data inline.
 * Shows skeleton while loading, error state on failure.
 */
export const LiveDataWidget: React.FC<LiveDataWidgetProps> = ({ type, symbol, className }) => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchLiveData(type, symbol)
      .then((data) => { if (!cancelled) { setLiveData(data); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [type, symbol]);

  if (loading) {
    return (
      <Box className={cn(styles.widget, styles.widgetLoading, className)}>
        <Box className={styles.skeleton} />
      </Box>
    );
  }

  if (error || !liveData) {
    return (
      <Box className={cn(styles.widget, styles.widgetError, className)}>
        <Text variant="caption" color="secondary">
          Live data unavailable for {symbol}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={cn(styles.widget, className)}>
      {type === 'stock' && <StockWidget data={liveData.data} symbol={symbol} />}
      {type === 'crypto' && <CryptoWidget data={liveData.data} symbol={symbol} />}
      {type === 'weather' && <WeatherWidget data={liveData.data} symbol={symbol} />}
      <Text variant="caption" color="tertiary" className={styles.liveLabel}>
        LIVE · {liveData.source}
      </Text>
    </Box>
  );
};

export default LiveDataWidget;
