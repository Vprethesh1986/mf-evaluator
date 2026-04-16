import { useState, useEffect, useRef, useCallback } from "react";

// ── 1164 Indian Mutual Funds (embedded) ──
const ALL_FUNDS = ["Aditya Birla Sun Life Arbitrage Fund - Direct Plan - Growth", "Aditya Birla Sun Life Arbitrage Fund - Regular Plan - Growth", "Aditya Birla Sun Life Balanced Advantage Fund - Direct Plan - Growth", "Aditya Birla Sun Life Balanced Advantage Fund - Regular Plan - Growth", "Aditya Birla Sun Life Banking & PSU Debt Fund - Direct Plan - Growth", "Aditya Birla Sun Life Banking & PSU Debt Fund - Regular Plan - Growth", "Aditya Birla Sun Life Banking and Financial Services Fund - Direct Plan - Growth", "Aditya Birla Sun Life Banking and Financial Services Fund - Regular Plan - Growth", "Aditya Birla Sun Life Bond Fund - Direct Plan - Growth", "Aditya Birla Sun Life Bond Fund - Regular Plan - Growth", "Aditya Birla Sun Life Business Cycle Fund - Direct Plan - Growth", "Aditya Birla Sun Life Business Cycle Fund - Regular Plan - Growth", "Aditya Birla Sun Life CEF - Global Agri Plan - Direct Plan - Growth", "Aditya Birla Sun Life Corporate Bond Fund - Direct Plan - Growth", "Aditya Birla Sun Life Corporate Bond Fund - Regular Plan - Growth", "Aditya Birla Sun Life Credit Risk Fund - Direct Plan - Growth", "Aditya Birla Sun Life Credit Risk Fund - Regular Plan - Growth", "Aditya Birla Sun Life Digital India Fund - Direct Plan - Growth", "Aditya Birla Sun Life Digital India Fund - Regular Plan - Growth", "Aditya Birla Sun Life Dividend Yield Fund - Direct Plan - Growth", "Aditya Birla Sun Life Dividend Yield Fund - Regular Plan - Growth", "Aditya Birla Sun Life Dynamic Bond Fund - Direct Plan - Growth", "Aditya Birla Sun Life Dynamic Bond Fund - Regular Plan - Growth", "Aditya Birla Sun Life ESG Integration Strategy Fund - Direct Plan - Growth", "Aditya Birla Sun Life Equity Advantage Fund - Direct Plan - Growth", "Aditya Birla Sun Life Equity Advantage Fund - Regular Plan - Growth", "Aditya Birla Sun Life Equity Fund - Direct Plan - Growth", "Aditya Birla Sun Life Equity Fund - Regular Plan - Growth", "Aditya Birla Sun Life Equity Hybrid 95 Fund - Direct Plan - Growth", "Aditya Birla Sun Life Equity Hybrid 95 Fund - Regular Plan - Growth", "Aditya Birla Sun Life Equity Savings Fund - Direct Plan - Growth", "Aditya Birla Sun Life Equity Savings Fund - Regular Plan - Growth", "Aditya Birla Sun Life Flexi Cap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Flexi Cap Fund - Regular Plan - Growth", "Aditya Birla Sun Life Focused Fund - Direct Plan - Growth", "Aditya Birla Sun Life Focused Fund - Regular Plan - Growth", "Aditya Birla Sun Life Frontline Equity Fund - Direct Plan - Growth", "Aditya Birla Sun Life Frontline Equity Fund - Regular Plan - Growth", "Aditya Birla Sun Life Gilt Fund - Direct Plan - Growth", "Aditya Birla Sun Life Gilt Fund - Regular Plan - Growth", "Aditya Birla Sun Life Gold Fund - Direct Plan - Growth", "Aditya Birla Sun Life Gold Fund - Regular Plan - Growth", "Aditya Birla Sun Life Index Fund - Nifty 50 - Direct Plan - Growth", "Aditya Birla Sun Life Index Fund - Nifty 50 - Regular Plan - Growth", "Aditya Birla Sun Life India GenNext Fund - Direct Plan - Growth", "Aditya Birla Sun Life India GenNext Fund - Regular Plan - Growth", "Aditya Birla Sun Life Infrastructure Fund - Direct Plan - Growth", "Aditya Birla Sun Life Infrastructure Fund - Regular Plan - Growth", "Aditya Birla Sun Life International Equity Fund - Plan A - Direct Plan - Growth", "Aditya Birla Sun Life Large & Mid Cap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Large & Mid Cap Fund - Regular Plan - Growth", "Aditya Birla Sun Life Liquid Fund - Direct Plan - Growth", "Aditya Birla Sun Life Liquid Fund - Regular Plan - Growth", "Aditya Birla Sun Life Long Duration Fund - Direct Plan - Growth", "Aditya Birla Sun Life Long Duration Fund - Regular Plan - Growth", "Aditya Birla Sun Life Low Duration Fund - Direct Plan - Growth", "Aditya Birla Sun Life Low Duration Fund - Regular Plan - Growth", "Aditya Birla Sun Life Medium Term Fund - Direct Plan - Growth", "Aditya Birla Sun Life Medium Term Fund - Regular Plan - Growth", "Aditya Birla Sun Life Mid Cap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Mid Cap Fund - Regular Plan - Growth", "Aditya Birla Sun Life Money Manager Fund - Direct Plan - Growth", "Aditya Birla Sun Life Money Manager Fund - Regular Plan - Growth", "Aditya Birla Sun Life Multi Asset Allocation Fund - Direct Plan - Growth", "Aditya Birla Sun Life Multi Asset Allocation Fund - Regular Plan - Growth", "Aditya Birla Sun Life Multicap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Multicap Fund - Regular Plan - Growth", "Aditya Birla Sun Life Nifty 50 Equal Weight Index Fund - Direct Plan - Growth", "Aditya Birla Sun Life Nifty Next 50 Index Fund - Direct Plan - Growth", "Aditya Birla Sun Life Nifty SDL Apr 2027 Index Fund - Direct Plan - Growth", "Aditya Birla Sun Life Overnight Fund - Direct Plan - Growth", "Aditya Birla Sun Life Overnight Fund - Regular Plan - Growth", "Aditya Birla Sun Life PSU Equity Fund - Direct Plan - Growth", "Aditya Birla Sun Life PSU Equity Fund - Regular Plan - Growth", "Aditya Birla Sun Life Pure Value Fund - Direct Plan - Growth", "Aditya Birla Sun Life Pure Value Fund - Regular Plan - Growth", "Aditya Birla Sun Life Retirement Fund - 30s Plan - Direct Plan - Growth", "Aditya Birla Sun Life Retirement Fund - 40s Plan - Direct Plan - Growth", "Aditya Birla Sun Life Savings Fund - Direct Plan - Growth", "Aditya Birla Sun Life Savings Fund - Regular Plan - Growth", "Aditya Birla Sun Life Short Term Fund - Direct Plan - Growth", "Aditya Birla Sun Life Short Term Fund - Regular Plan - Growth", "Aditya Birla Sun Life Small Cap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Small Cap Fund - Regular Plan - Growth", "Aditya Birla Sun Life Tax Plan - Direct Plan - Growth", "Aditya Birla Sun Life Tax Plan - Regular Plan - Growth", "Aditya Birla Sun Life Tax Relief 96 - Direct Plan - Growth", "Aditya Birla Sun Life Tax Relief 96 - Regular Plan - Growth", "Aditya Birla Sun Life Ultra Short Term Fund - Direct Plan - Growth", "Aditya Birla Sun Life Ultra Short Term Fund - Regular Plan - Growth", "Axis Arbitrage Fund - Direct Plan - Growth", "Axis Arbitrage Fund - Regular Plan - Growth", "Axis Banking & PSU Debt Fund - Direct Plan - Growth", "Axis Banking & PSU Debt Fund - Regular Plan - Growth", "Axis Bluechip Fund - Direct Plan - Growth", "Axis Bluechip Fund - Regular Plan - Growth", "Axis Business Cycles Fund - Direct Plan - Growth", "Axis Business Cycles Fund - Regular Plan - Growth", "Axis Children's Gift Fund - Direct Plan - Growth", "Axis Children's Gift Fund - Regular Plan - Growth", "Axis Corporate Debt Fund - Direct Plan - Growth", "Axis Corporate Debt Fund - Regular Plan - Growth", "Axis Credit Risk Fund - Direct Plan - Growth", "Axis Credit Risk Fund - Regular Plan - Growth", "Axis Dynamic Bond Fund - Direct Plan - Growth", "Axis Dynamic Bond Fund - Regular Plan - Growth", "Axis Dynamic Equity Fund - Direct Plan - Growth", "Axis Dynamic Equity Fund - Regular Plan - Growth", "Axis ESG Integration Strategy Fund - Direct Plan - Growth", "Axis ESG Integration Strategy Fund - Regular Plan - Growth", "Axis Equity Advantage Fund - Direct Plan - Growth", "Axis Equity Advantage Fund - Regular Plan - Growth", "Axis Equity ETF FOF - Direct Plan - Growth", "Axis Equity Hybrid Fund - Direct Plan - Growth", "Axis Equity Hybrid Fund - Regular Plan - Growth", "Axis Equity Saver Fund - Direct Plan - Growth", "Axis Equity Saver Fund - Regular Plan - Growth", "Axis Flexi Cap Fund - Direct Plan - Growth", "Axis Flexi Cap Fund - Regular Plan - Growth", "Axis Focused 25 Fund - Direct Plan - Growth", "Axis Focused 25 Fund - Regular Plan - Growth", "Axis Gilt Fund - Direct Plan - Growth", "Axis Gilt Fund - Regular Plan - Growth", "Axis Gold ETF FOF - Direct Plan - Growth", "Axis Gold ETF FOF - Regular Plan - Growth", "Axis Growth Opportunities Fund - Direct Plan - Growth", "Axis Growth Opportunities Fund - Regular Plan - Growth", "Axis Large & Mid Cap Fund - Direct Plan - Growth", "Axis Large & Mid Cap Fund - Regular Plan - Growth", "Axis Liquid Fund - Direct Plan - Growth", "Axis Liquid Fund - Regular Plan - Growth", "Axis Long Term Equity Fund - Direct Plan - Growth", "Axis Long Term Equity Fund - Regular Plan - Growth", "Axis Low Duration Fund - Direct Plan - Growth", "Axis Low Duration Fund - Regular Plan - Growth", "Axis Mid Cap Fund - Direct Plan - Growth", "Axis Mid Cap Fund - Regular Plan - Growth", "Axis Money Market Fund - Direct Plan - Growth", "Axis Money Market Fund - Regular Plan - Growth", "Axis Multi Asset Allocation Fund - Direct Plan - Growth", "Axis Multi Asset Allocation Fund - Regular Plan - Growth", "Axis Multicap Fund - Direct Plan - Growth", "Axis Multicap Fund - Regular Plan - Growth", "Axis Nifty 100 Index Fund - Direct Plan - Growth", "Axis Nifty 100 Index Fund - Regular Plan - Growth", "Axis Nifty 50 Index Fund - Direct Plan - Growth", "Axis Nifty 50 Index Fund - Regular Plan - Growth", "Axis Nifty Next 50 Index Fund - Direct Plan - Growth", "Axis Nifty Next 50 Index Fund - Regular Plan - Growth", "Axis Overnight Fund - Direct Plan - Growth", "Axis Overnight Fund - Regular Plan - Growth", "Axis Quant Fund - Direct Plan - Growth", "Axis Quant Fund - Regular Plan - Growth", "Axis Retirement Savings Fund - Aggressive Plan - Direct Plan - Growth", "Axis Retirement Savings Fund - Aggressive Plan - Regular Plan - Growth", "Axis Retirement Savings Fund - Conservative Plan - Direct Plan - Growth", "Axis Retirement Savings Fund - Conservative Plan - Regular Plan - Growth", "Axis Retirement Savings Fund - Dynamic Plan - Direct Plan - Growth", "Axis Retirement Savings Fund - Dynamic Plan - Regular Plan - Growth", "Axis Short Term Fund - Direct Plan - Growth", "Axis Short Term Fund - Regular Plan - Growth", "Axis Small Cap Fund - Direct Plan - Growth", "Axis Small Cap Fund - Regular Plan - Growth", "Axis Special Situations Fund - Direct Plan - Growth", "Axis Special Situations Fund - Regular Plan - Growth", "Axis Strategic Bond Fund - Direct Plan - Growth", "Axis Strategic Bond Fund - Regular Plan - Growth", "Axis Treasury Advantage Fund - Direct Plan - Growth", "Axis Treasury Advantage Fund - Regular Plan - Growth", "Axis Ultra Short Term Fund - Direct Plan - Growth", "Axis Ultra Short Term Fund - Regular Plan - Growth", "Bandhan Arbitrage Fund - Direct Plan - Growth", "Bandhan Arbitrage Fund - Regular Plan - Growth", "Bandhan Balanced Advantage Fund - Direct Plan - Growth", "Bandhan Balanced Advantage Fund - Regular Plan - Growth", "Bandhan Banking & PSU Debt Fund - Direct Plan - Growth", "Bandhan Banking & PSU Debt Fund - Regular Plan - Growth", "Bandhan Bond Fund - Income Plan - Direct Plan - Growth", "Bandhan Bond Fund - Short Term Plan - Direct Plan - Growth", "Bandhan Core Equity Fund - Direct Plan - Growth", "Bandhan Core Equity Fund - Regular Plan - Growth", "Bandhan Corporate Bond Fund - Direct Plan - Growth", "Bandhan Corporate Bond Fund - Regular Plan - Growth", "Bandhan Credit Risk Fund - Direct Plan - Growth", "Bandhan Dynamic Bond Fund - Direct Plan - Growth", "Bandhan ELSS Tax Saver Fund - Direct Plan - Growth", "Bandhan ELSS Tax Saver Fund - Regular Plan - Growth", "Bandhan Equity Savings Fund - Direct Plan - Growth", "Bandhan Flexi Cap Fund - Direct Plan - Growth", "Bandhan Flexi Cap Fund - Regular Plan - Growth", "Bandhan Focused Equity Fund - Direct Plan - Growth", "Bandhan Gilt Fund - Direct Plan - Growth", "Bandhan Infrastructure Fund - Direct Plan - Growth", "Bandhan Large & Mid Cap Fund - Direct Plan - Growth", "Bandhan Large Cap Fund - Direct Plan - Growth", "Bandhan Liquid Fund - Direct Plan - Growth", "Bandhan Liquid Fund - Regular Plan - Growth", "Bandhan Low Duration Fund - Direct Plan - Growth", "Bandhan Mid Cap Fund - Direct Plan - Growth", "Bandhan Money Manager Fund - Direct Plan - Growth", "Bandhan Multi Cap Fund - Direct Plan - Growth", "Bandhan Nifty 50 Index Fund - Direct Plan - Growth", "Bandhan Overnight Fund - Direct Plan - Growth", "Bandhan Short Duration Fund - Direct Plan - Growth", "Bandhan Small Cap Fund - Direct Plan - Growth", "Bandhan Small Cap Fund - Regular Plan - Growth", "Bandhan Sterling Value Fund - Direct Plan - Growth", "Bandhan Ultra Short Term Fund - Direct Plan - Growth", "Canara Robeco Balanced Advantage Fund - Direct Plan - Growth", "Canara Robeco Balanced Advantage Fund - Regular Plan - Growth", "Canara Robeco Bluechip Equity Fund - Direct Plan - Growth", "Canara Robeco Bluechip Equity Fund - Regular Plan - Growth", "Canara Robeco Conservative Hybrid Fund - Direct Plan - Growth", "Canara Robeco Consumer Trends Fund - Direct Plan - Growth", "Canara Robeco Emerging Equities Fund - Direct Plan - Growth", "Canara Robeco Emerging Equities Fund - Regular Plan - Growth", "Canara Robeco Equity Diversified Fund - Direct Plan - Growth", "Canara Robeco Equity Hybrid Fund - Direct Plan - Growth", "Canara Robeco Equity Hybrid Fund - Regular Plan - Growth", "Canara Robeco Equity Savings Fund - Direct Plan - Growth", "Canara Robeco Equity Tax Saver Fund - Direct Plan - Growth", "Canara Robeco Equity Tax Saver Fund - Regular Plan - Growth", "Canara Robeco Flexi Cap Fund - Direct Plan - Growth", "Canara Robeco Flexi Cap Fund - Regular Plan - Growth", "Canara Robeco Focused Equity Fund - Direct Plan - Growth", "Canara Robeco Infrastructure Fund - Direct Plan - Growth", "Canara Robeco Large & Mid Cap Fund - Direct Plan - Growth", "Canara Robeco Liquid Fund - Direct Plan - Growth", "Canara Robeco Mid Cap Fund - Direct Plan - Growth", "Canara Robeco Mid Cap Fund - Regular Plan - Growth", "Canara Robeco Multi Cap Fund - Direct Plan - Growth", "Canara Robeco Nifty 50 Index Fund - Direct Plan - Growth", "Canara Robeco Overnight Fund - Direct Plan - Growth", "Canara Robeco Small Cap Fund - Direct Plan - Growth", "Canara Robeco Small Cap Fund - Regular Plan - Growth", "Canara Robeco Ultra Short Term Fund - Direct Plan - Growth", "Canara Robeco Value Fund - Direct Plan - Growth", "DSP Banking & PSU Debt Fund - Direct Plan - Growth", "DSP Banking & PSU Debt Fund - Regular Plan - Growth", "DSP Bond Fund - Direct Plan - Growth", "DSP Bond Fund - Regular Plan - Growth", "DSP Corporate Bond Fund - Direct Plan - Growth", "DSP Corporate Bond Fund - Regular Plan - Growth", "DSP Credit Risk Fund - Direct Plan - Growth", "DSP Credit Risk Fund - Regular Plan - Growth", "DSP Dynamic Asset Allocation Fund - Direct Plan - Growth", "DSP Dynamic Asset Allocation Fund - Regular Plan - Growth", "DSP Equity & Bond Fund - Direct Plan - Growth", "DSP Equity & Bond Fund - Regular Plan - Growth", "DSP Equity Opportunities Fund - Direct Plan - Growth", "DSP Equity Opportunities Fund - Regular Plan - Growth", "DSP Equity Savings Fund - Direct Plan - Growth", "DSP Equity Savings Fund - Regular Plan - Growth", "DSP Flexi Cap Fund - Direct Plan - Growth", "DSP Flexi Cap Fund - Regular Plan - Growth", "DSP Focus Fund - Direct Plan - Growth", "DSP Focus Fund - Regular Plan - Growth", "DSP Gilt Fund - Direct Plan - Growth", "DSP Gilt Fund - Regular Plan - Growth", "DSP Global Allocation Fund - Direct Plan - Growth", "DSP Global Allocation Fund - Regular Plan - Growth", "DSP Healthcare Fund - Direct Plan - Growth", "DSP Healthcare Fund - Regular Plan - Growth", "DSP Index Fund - Nifty 50 - Direct Plan - Growth", "DSP Index Fund - Nifty 50 - Regular Plan - Growth", "DSP Index Fund - Nifty Next 50 - Direct Plan - Growth", "DSP Index Fund - Nifty Next 50 - Regular Plan - Growth", "DSP Liquid Fund - Direct Plan - Growth", "DSP Liquid Fund - Regular Plan - Growth", "DSP Low Duration Fund - Direct Plan - Growth", "DSP Low Duration Fund - Regular Plan - Growth", "DSP Mid Cap Fund - Direct Plan - Growth", "DSP Mid Cap Fund - Regular Plan - Growth", "DSP Midcap Fund - Regular Plan - Growth", "DSP Money Manager Fund - Direct Plan - Growth", "DSP Money Manager Fund - Regular Plan - Growth", "DSP Multi Asset Allocation Fund - Direct Plan - Growth", "DSP Multi Asset Allocation Fund - Regular Plan - Growth", "DSP Multicap Fund - Direct Plan - Growth", "DSP Multicap Fund - Regular Plan - Growth", "DSP Natural Resources and New Energy Fund - Direct Plan - Growth", "DSP Natural Resources and New Energy Fund - Regular Plan - Growth", "DSP Nifty 50 Equal Weight Index Fund - Direct Plan - Growth", "DSP Nifty SDL Plus G-Sec Jun 2028 30:70 Index Fund - Direct Plan - Growth", "DSP Overnight Fund - Direct Plan - Growth", "DSP Overnight Fund - Regular Plan - Growth", "DSP Quant Fund - Direct Plan - Growth", "DSP Quant Fund - Regular Plan - Growth", "DSP Savings Fund - Direct Plan - Growth", "DSP Savings Fund - Regular Plan - Growth", "DSP Short Term Fund - Direct Plan - Growth", "DSP Short Term Fund - Regular Plan - Growth", "DSP Small Cap Fund - Direct Plan - Growth", "DSP Small Cap Fund - Regular Plan - Growth", "DSP Tax Saver Fund - Direct Plan - Growth", "DSP Tax Saver Fund - Regular Plan - Growth", "DSP Top 100 Equity Fund - Direct Plan - Growth", "DSP Top 100 Equity Fund - Regular Plan - Growth", "DSP US Flexible Equity Fund - Direct Plan - Growth", "DSP US Flexible Equity Fund - Regular Plan - Growth", "DSP Ultra Short Fund - Direct Plan - Growth", "DSP Ultra Short Fund - Regular Plan - Growth", "DSP Value Fund - Direct Plan - Growth", "DSP Value Fund - Regular Plan - Growth", "Edelweiss Arbitrage Fund - Direct Plan - Growth", "Edelweiss Balanced Advantage Fund - Direct Plan - Growth", "Edelweiss Banking and PSU Debt Fund - Direct Plan - Growth", "Edelweiss Corporate Bond Fund - Direct Plan - Growth", "Edelweiss ELSS Tax Saver Fund - Direct Plan - Growth", "Edelweiss Emerging Markets Opportunities Equity Offshore Fund - Direct Plan - Growth", "Edelweiss Equity Savings Fund - Direct Plan - Growth", "Edelweiss Flexi Cap Fund - Direct Plan - Growth", "Edelweiss Focused Fund - Direct Plan - Growth", "Edelweiss Gold and Silver ETF FOF - Direct Plan - Growth", "Edelweiss Large & Mid Cap Fund - Direct Plan - Growth", "Edelweiss Large Cap Fund - Direct Plan - Growth", "Edelweiss Liquid Fund - Direct Plan - Growth", "Edelweiss Mid Cap Fund - Direct Plan - Growth", "Edelweiss Money Market Fund - Direct Plan - Growth", "Edelweiss Multi Asset Allocation Fund - Direct Plan - Growth", "Edelweiss Multi Cap Fund - Direct Plan - Growth", "Edelweiss Nifty 50 Index Fund - Direct Plan - Growth", "Edelweiss Overnight Fund - Direct Plan - Growth", "Edelweiss Small Cap Fund - Direct Plan - Growth", "Edelweiss US Technology Equity FOF - Direct Plan - Growth", "Franklin India Bluechip Fund - Direct Plan - Growth", "Franklin India Bluechip Fund - Regular Plan - Growth", "Franklin India Corporate Debt Fund - Direct Plan - Growth", "Franklin India Corporate Debt Fund - Regular Plan - Growth", "Franklin India Dynamic Accrual Fund - Direct Plan - Growth", "Franklin India Dynamic Accrual Fund - Regular Plan - Growth", "Franklin India Dynamic Asset Allocation Funds of Funds - Direct Plan - Growth", "Franklin India Equity Advantage Fund - Direct Plan - Growth", "Franklin India Equity Advantage Fund - Regular Plan - Growth", "Franklin India Equity Fund - Direct Plan - Growth", "Franklin India Equity Fund - Regular Plan - Growth", "Franklin India Equity Hybrid Fund - Direct Plan - Growth", "Franklin India Equity Hybrid Fund - Regular Plan - Growth", "Franklin India Equity Savings Fund - Direct Plan - Growth", "Franklin India Equity Savings Fund - Regular Plan - Growth", "Franklin India Feeder - Franklin U.S. Opportunities Fund - Direct Plan - Growth", "Franklin India Feeder - Templeton European Opportunities Fund - Direct Plan - Growth", "Franklin India Flexi Cap Fund - Direct Plan - Growth", "Franklin India Flexi Cap Fund - Regular Plan - Growth", "Franklin India Focused Equity Fund - Direct Plan - Growth", "Franklin India Focused Equity Fund - Regular Plan - Growth", "Franklin India Government Securities Fund - Direct Plan - Growth", "Franklin India Government Securities Fund - Regular Plan - Growth", "Franklin India Index Fund - BSE Sensex Plan - Direct Plan - Growth", "Franklin India Index Fund - NSE Nifty Plan - Direct Plan - Growth", "Franklin India Liquid Fund - Direct Plan - Growth", "Franklin India Liquid Fund - Regular Plan - Growth", "Franklin India Long Duration Fund - Direct Plan - Growth", "Franklin India Long Duration Fund - Regular Plan - Growth", "Franklin India Low Duration Fund - Direct Plan - Growth", "Franklin India Low Duration Fund - Regular Plan - Growth", "Franklin India Money Market Fund - Direct Plan - Growth", "Franklin India Money Market Fund - Regular Plan - Growth", "Franklin India Multi Asset Solution Fund - Direct Plan - Growth", "Franklin India Overnight Fund - Direct Plan - Growth", "Franklin India Overnight Fund - Regular Plan - Growth", "Franklin India Prima Fund - Direct Plan - Growth", "Franklin India Prima Fund - Regular Plan - Growth", "Franklin India Savings Fund - Direct Plan - Growth", "Franklin India Savings Fund - Regular Plan - Growth", "Franklin India Short Duration Fund - Direct Plan - Growth", "Franklin India Short Duration Fund - Regular Plan - Growth", "Franklin India Smaller Companies Fund - Direct Plan - Growth", "Franklin India Smaller Companies Fund - Regular Plan - Growth", "Franklin India Taxshield - Direct Plan - Growth", "Franklin India Taxshield - Regular Plan - Growth", "Franklin India Technology Fund - Direct Plan - Growth", "Franklin India Technology Fund - Regular Plan - Growth", "Franklin India Ultra Short Bond Fund - Direct Plan - Growth", "Franklin India Ultra Short Bond Fund - Regular Plan - Growth", "HDFC Balanced Advantage Fund - Direct Plan - Growth", "HDFC Balanced Advantage Fund - Regular Plan - Growth", "HDFC Banking and PSU Debt Fund - Direct Plan - Growth", "HDFC Banking and PSU Debt Fund - Regular Plan - Growth", "HDFC Corporate Bond Fund - Direct Plan - Growth", "HDFC Corporate Bond Fund - Regular Plan - Growth", "HDFC Credit Risk Debt Fund - Direct Plan - Growth", "HDFC Credit Risk Debt Fund - Regular Plan - Growth", "HDFC Equity Fund - Direct Plan - Growth", "HDFC Equity Fund - Regular Plan - Growth", "HDFC Equity Savings Fund - Direct Plan - Growth", "HDFC Equity Savings Fund - Regular Plan - Growth", "HDFC Flexi Cap Fund - Direct Plan - Growth", "HDFC Flexi Cap Fund - Regular Plan - Growth", "HDFC Focused 30 Fund - Direct Plan - Growth", "HDFC Focused 30 Fund - Regular Plan - Growth", "HDFC Gilt Fund - Direct Plan - Growth", "HDFC Gilt Fund - Regular Plan - Growth", "HDFC Housing Opportunities Fund - Direct Plan - Growth", "HDFC Housing Opportunities Fund - Regular Plan - Growth", "HDFC Hybrid Debt Fund - Direct Plan - Growth", "HDFC Hybrid Debt Fund - Regular Plan - Growth", "HDFC Index Fund - NIFTY 50 Plan - Direct Plan - Growth", "HDFC Index Fund - NIFTY 50 Plan - Regular Plan - Growth", "HDFC Index Fund - NIFTY Next 50 Plan - Direct Plan - Growth", "HDFC Index Fund - NIFTY Next 50 Plan - Regular Plan - Growth", "HDFC Index Fund - Sensex Plan - Direct Plan - Growth", "HDFC Index Fund - Sensex Plan - Regular Plan - Growth", "HDFC Large Cap Fund - Direct Plan - Growth", "HDFC Large Cap Fund - Regular Plan - Growth", "HDFC Large and Mid Cap Fund - Direct Plan - Growth", "HDFC Large and Mid Cap Fund - Regular Plan - Growth", "HDFC Liquid Fund - Direct Plan - Growth", "HDFC Liquid Fund - Regular Plan - Growth", "HDFC Low Duration Fund - Direct Plan - Growth", "HDFC Low Duration Fund - Regular Plan - Growth", "HDFC Mid Cap Opportunities Fund - Direct Plan - Growth", "HDFC Mid Cap Opportunities Fund - Regular Plan - Growth", "HDFC Money Market Fund - Direct Plan - Growth", "HDFC Money Market Fund - Regular Plan - Growth", "HDFC Multi Asset Fund - Direct Plan - Growth", "HDFC Multi Asset Fund - Regular Plan - Growth", "HDFC Multi Cap Fund - Direct Plan - Growth", "HDFC Multi Cap Fund - Regular Plan - Growth", "HDFC Nifty Alpha 50 ETF FOF - Direct Plan - Growth", "HDFC Nifty Alpha 50 ETF FOF - Regular Plan - Growth", "HDFC Nifty100 Equal Weight Index Fund - Direct Plan - Growth", "HDFC Nifty100 Equal Weight Index Fund - Regular Plan - Growth", "HDFC Overnight Fund - Direct Plan - Growth", "HDFC Overnight Fund - Regular Plan - Growth", "HDFC Retirement Savings Fund - Equity Plan - Direct Plan - Growth", "HDFC Retirement Savings Fund - Equity Plan - Regular Plan - Growth", "HDFC Retirement Savings Fund - Hybrid Equity Plan - Direct Plan - Growth", "HDFC Retirement Savings Fund - Hybrid Equity Plan - Regular Plan - Growth", "HDFC Sensex Index Fund - Direct Plan - Growth", "HDFC Sensex Index Fund - Regular Plan - Growth", "HDFC Short Term Debt Fund - Direct Plan - Growth", "HDFC Short Term Debt Fund - Regular Plan - Growth", "HDFC Small Cap Fund - Direct Plan - Growth", "HDFC Small Cap Fund - Regular Plan - Growth", "HDFC Top 100 Fund - Direct Plan - Growth", "HDFC Top 100 Fund - Regular Plan - Growth", "HDFC Ultra Short Term Fund - Direct Plan - Growth", "HDFC Ultra Short Term Fund - Regular Plan - Growth", "HSBC Aggressive Hybrid Fund - Direct Plan - Growth", "HSBC Balanced Advantage Fund - Direct Plan - Growth", "HSBC Banking and PSU Debt Fund - Direct Plan - Growth", "HSBC Business Cycles Fund - Direct Plan - Growth", "HSBC Corporate Bond Fund - Direct Plan - Growth", "HSBC Dividend Yield Fund - Direct Plan - Growth", "HSBC Dynamic Bond Fund - Direct Plan - Growth", "HSBC ELSS Tax Saver Fund - Direct Plan - Growth", "HSBC Equity Savings Fund - Direct Plan - Growth", "HSBC Flexi Cap Fund - Direct Plan - Growth", "HSBC Focused Fund - Direct Plan - Growth", "HSBC Gilt Fund - Direct Plan - Growth", "HSBC Infrastructure Fund - Direct Plan - Growth", "HSBC Large & Mid Cap Fund - Direct Plan - Growth", "HSBC Large Cap Fund - Direct Plan - Growth", "HSBC Liquid Fund - Direct Plan - Growth", "HSBC Low Duration Fund - Direct Plan - Growth", "HSBC Mid Cap Fund - Direct Plan - Growth", "HSBC Money Market Fund - Direct Plan - Growth", "HSBC Multi Cap Fund - Direct Plan - Growth", "HSBC Nifty 50 Index Fund - Direct Plan - Growth", "HSBC Overnight Fund - Direct Plan - Growth", "HSBC Short Duration Fund - Direct Plan - Growth", "HSBC Small Cap Fund - Direct Plan - Growth", "HSBC Tax Saver Equity Fund - Direct Plan - Growth", "HSBC Ultra Short Duration Fund - Direct Plan - Growth", "HSBC Value Fund - Direct Plan - Growth", "ICICI Prudential All Seasons Bond Fund - Direct Plan - Growth", "ICICI Prudential All Seasons Bond Fund - Regular Plan - Growth", "ICICI Prudential Balanced Advantage Fund - Direct Plan - Growth", "ICICI Prudential Balanced Advantage Fund - Regular Plan - Growth", "ICICI Prudential Banking & Financial Services Fund - Direct Plan - Growth", "ICICI Prudential Banking & Financial Services Fund - Regular Plan - Growth", "ICICI Prudential Bluechip Fund - Direct Plan - Growth", "ICICI Prudential Bluechip Fund - Regular Plan - Growth", "ICICI Prudential Bond Fund - Direct Plan - Growth", "ICICI Prudential Bond Fund - Regular Plan - Growth", "ICICI Prudential Business Cycle Fund - Direct Plan - Growth", "ICICI Prudential Business Cycle Fund - Regular Plan - Growth", "ICICI Prudential Child Care Fund - Gift Plan - Direct Plan - Growth", "ICICI Prudential Child Care Fund - Gift Plan - Regular Plan - Growth", "ICICI Prudential Commodities Fund - Direct Plan - Growth", "ICICI Prudential Commodities Fund - Regular Plan - Growth", "ICICI Prudential Corporate Bond Fund - Direct Plan - Growth", "ICICI Prudential Corporate Bond Fund - Regular Plan - Growth", "ICICI Prudential Credit Risk Fund - Direct Plan - Growth", "ICICI Prudential Credit Risk Fund - Regular Plan - Growth", "ICICI Prudential Debt Management Fund - Direct Plan - Growth", "ICICI Prudential Debt Management Fund - Regular Plan - Growth", "ICICI Prudential Dividend Yield Equity Fund - Direct Plan - Growth", "ICICI Prudential Dividend Yield Equity Fund - Regular Plan - Growth", "ICICI Prudential Equity & Debt Fund - Direct Plan - Growth", "ICICI Prudential Equity & Debt Fund - Regular Plan - Growth", "ICICI Prudential Equity Arbitrage Fund - Direct Plan - Growth", "ICICI Prudential Equity Arbitrage Fund - Regular Plan - Growth", "ICICI Prudential Equity Savings Fund - Direct Plan - Growth", "ICICI Prudential Equity Savings Fund - Regular Plan - Growth", "ICICI Prudential Flexi Cap Fund - Direct Plan - Growth", "ICICI Prudential Flexi Cap Fund - Regular Plan - Growth", "ICICI Prudential Focused Equity Fund - Direct Plan - Growth", "ICICI Prudential Focused Equity Fund - Regular Plan - Growth", "ICICI Prudential Gilt Fund - Direct Plan - Growth", "ICICI Prudential Gilt Fund - Regular Plan - Growth", "ICICI Prudential India Opportunities Fund - Direct Plan - Growth", "ICICI Prudential India Opportunities Fund - Regular Plan - Growth", "ICICI Prudential Infrastructure Fund - Direct Plan - Growth", "ICICI Prudential Infrastructure Fund - Regular Plan - Growth", "ICICI Prudential Large & Mid Cap Fund - Direct Plan - Growth", "ICICI Prudential Large & Mid Cap Fund - Regular Plan - Growth", "ICICI Prudential Liquid Fund - Direct Plan - Growth", "ICICI Prudential Liquid Fund - Regular Plan - Growth", "ICICI Prudential Long Term Bond Fund - Direct Plan - Growth", "ICICI Prudential Long Term Bond Fund - Regular Plan - Growth", "ICICI Prudential Long Term Equity Fund (Tax Saving) - Direct Plan - Growth", "ICICI Prudential Long Term Equity Fund (Tax Saving) - Regular Plan - Growth", "ICICI Prudential Low Duration Fund - Direct Plan - Growth", "ICICI Prudential Low Duration Fund - Regular Plan - Growth", "ICICI Prudential Medium Term Bond Fund - Direct Plan - Growth", "ICICI Prudential Medium Term Bond Fund - Regular Plan - Growth", "ICICI Prudential MidCap Fund - Direct Plan - Growth", "ICICI Prudential MidCap Fund - Regular Plan - Growth", "ICICI Prudential Money Market Fund - Direct Plan - Growth", "ICICI Prudential Money Market Fund - Regular Plan - Growth", "ICICI Prudential Multi Asset Fund - Direct Plan - Growth", "ICICI Prudential Multi Asset Fund - Regular Plan - Growth", "ICICI Prudential Multicap Fund - Direct Plan - Growth", "ICICI Prudential Multicap Fund - Regular Plan - Growth", "ICICI Prudential Nifty 50 Index Fund - Direct Plan - Growth", "ICICI Prudential Nifty 50 Index Fund - Regular Plan - Growth", "ICICI Prudential Nifty Next 50 Index Fund - Direct Plan - Growth", "ICICI Prudential Nifty Next 50 Index Fund - Regular Plan - Growth", "ICICI Prudential Overnight Fund - Direct Plan - Growth", "ICICI Prudential Overnight Fund - Regular Plan - Growth", "ICICI Prudential PSU Bond plus SDL 40:60 Index Fund - Direct Plan - Growth", "ICICI Prudential Retirement Fund - Pure Equity Plan - Direct Plan - Growth", "ICICI Prudential Retirement Fund - Pure Equity Plan - Regular Plan - Growth", "ICICI Prudential Savings Fund - Direct Plan - Growth", "ICICI Prudential Savings Fund - Regular Plan - Growth", "ICICI Prudential Sensex Index Fund - Direct Plan - Growth", "ICICI Prudential Sensex Index Fund - Regular Plan - Growth", "ICICI Prudential Short Term Fund - Direct Plan - Growth", "ICICI Prudential Short Term Fund - Regular Plan - Growth", "ICICI Prudential Smallcap Fund - Direct Plan - Growth", "ICICI Prudential Smallcap Fund - Regular Plan - Growth", "ICICI Prudential Technology Fund - Direct Plan - Growth", "ICICI Prudential Technology Fund - Regular Plan - Growth", "ICICI Prudential Transportation and Logistics Fund - Direct Plan - Growth", "ICICI Prudential Transportation and Logistics Fund - Regular Plan - Growth", "ICICI Prudential Ultra Short Term Fund - Direct Plan - Growth", "ICICI Prudential Ultra Short Term Fund - Regular Plan - Growth", "ICICI Prudential Value Discovery Fund - Direct Plan - Growth", "ICICI Prudential Value Discovery Fund - Regular Plan - Growth", "Invesco India Arbitrage Fund - Direct Plan - Growth", "Invesco India Balanced Advantage Fund - Direct Plan - Growth", "Invesco India Banking & PSU Debt Fund - Direct Plan - Growth", "Invesco India Bond Fund - Direct Plan - Growth", "Invesco India Contra Fund - Direct Plan - Growth", "Invesco India Contra Fund - Regular Plan - Growth", "Invesco India Corporate Bond Fund - Direct Plan - Growth", "Invesco India Dynamic Equity Fund - Direct Plan - Growth", "Invesco India ELSS Tax Saver Fund - Direct Plan - Growth", "Invesco India Financial Services Fund - Direct Plan - Growth", "Invesco India Flexi Cap Fund - Direct Plan - Growth", "Invesco India Flexi Cap Fund - Regular Plan - Growth", "Invesco India Focused Fund - Direct Plan - Growth", "Invesco India Gold ETF FOF - Direct Plan - Growth", "Invesco India Infrastructure Fund - Direct Plan - Growth", "Invesco India Large & Mid Cap Fund - Direct Plan - Growth", "Invesco India Largecap Fund - Direct Plan - Growth", "Invesco India Liquid Fund - Direct Plan - Growth", "Invesco India Mid Cap Fund - Direct Plan - Growth", "Invesco India Mid Cap Fund - Regular Plan - Growth", "Invesco India Money Market Fund - Direct Plan - Growth", "Invesco India Multi Asset Allocation Fund - Direct Plan - Growth", "Invesco India Multicap Fund - Direct Plan - Growth", "Invesco India Nifty 50 ETF FOF - Direct Plan - Growth", "Invesco India Nifty G-Sec Sep 2032 Index Fund - Direct Plan - Growth", "Invesco India Overnight Fund - Direct Plan - Growth", "Invesco India PSU Equity Fund - Direct Plan - Growth", "Invesco India Short Duration Fund - Direct Plan - Growth", "Invesco India Small Cap Fund - Direct Plan - Growth", "Invesco India Small Cap Fund - Regular Plan - Growth", "Invesco India Technology Fund - Direct Plan - Growth", "Invesco India Ultra Short Term Fund - Direct Plan - Growth", "Kotak Balanced Advantage Fund - Direct Plan - Growth", "Kotak Balanced Advantage Fund - Regular Plan - Growth", "Kotak Banking and PSU Debt Fund - Direct Plan - Growth", "Kotak Banking and PSU Debt Fund - Regular Plan - Growth", "Kotak Bond Fund - Direct Plan - Growth", "Kotak Bond Fund - Regular Plan - Growth", "Kotak Business Cycle Fund - Direct Plan - Growth", "Kotak Business Cycle Fund - Regular Plan - Growth", "Kotak Corporate Bond Fund - Direct Plan - Growth", "Kotak Corporate Bond Fund - Regular Plan - Growth", "Kotak Credit Risk Fund - Direct Plan - Growth", "Kotak Credit Risk Fund - Regular Plan - Growth", "Kotak Dynamic Bond Fund - Direct Plan - Growth", "Kotak Dynamic Bond Fund - Regular Plan - Growth", "Kotak ESG Exclusionary Strategy Fund - Direct Plan - Growth", "Kotak Emerging Equity Fund - Direct Plan - Growth", "Kotak Emerging Equity Fund - Regular Plan - Growth", "Kotak Equity Arbitrage Fund - Direct Plan - Growth", "Kotak Equity Arbitrage Fund - Regular Plan - Growth", "Kotak Equity Hybrid Fund - Direct Plan - Growth", "Kotak Equity Hybrid Fund - Regular Plan - Growth", "Kotak Equity Opportunities Fund - Direct Plan - Growth", "Kotak Equity Opportunities Fund - Regular Plan - Growth", "Kotak Flexi Cap Fund - Direct Plan - Growth", "Kotak Flexi Cap Fund - Regular Plan - Growth", "Kotak Focused Equity Fund - Direct Plan - Growth", "Kotak Focused Equity Fund - Regular Plan - Growth", "Kotak Gilt Fund - Direct Plan - Growth", "Kotak Gilt Fund - Regular Plan - Growth", "Kotak Global Innovation FOF - Direct Plan - Growth", "Kotak Global Innovation FOF - Regular Plan - Growth", "Kotak India EQ Contra Fund - Direct Plan - Growth", "Kotak India EQ Contra Fund - Regular Plan - Growth", "Kotak Infrastructure & Economic Reform Fund - Direct Plan - Growth", "Kotak Infrastructure & Economic Reform Fund - Regular Plan - Growth", "Kotak Large & Mid Cap Fund - Direct Plan - Growth", "Kotak Large & Mid Cap Fund - Regular Plan - Growth", "Kotak Liquid Fund - Direct Plan - Growth", "Kotak Liquid Fund - Regular Plan - Growth", "Kotak Long Duration Fund - Direct Plan - Growth", "Kotak Long Duration Fund - Regular Plan - Growth", "Kotak Low Duration Fund - Direct Plan - Growth", "Kotak Low Duration Fund - Regular Plan - Growth", "Kotak Manufacture in India Fund - Direct Plan - Growth", "Kotak Manufacture in India Fund - Regular Plan - Growth", "Kotak Medium Term Fund - Direct Plan - Growth", "Kotak Medium Term Fund - Regular Plan - Growth", "Kotak Money Market Fund - Direct Plan - Growth", "Kotak Money Market Fund - Regular Plan - Growth", "Kotak Multi Asset Allocator FOF - Dynamic Plan - Direct Plan - Growth", "Kotak Multicap Fund - Direct Plan - Growth", "Kotak Multicap Fund - Regular Plan - Growth", "Kotak Nifty 50 Index Fund - Direct Plan - Growth", "Kotak Nifty 50 Index Fund - Regular Plan - Growth", "Kotak Nifty Alpha 50 Index Fund - Direct Plan - Growth", "Kotak Nifty Next 50 Index Fund - Direct Plan - Growth", "Kotak Nifty Next 50 Index Fund - Regular Plan - Growth", "Kotak Overnight Fund - Direct Plan - Growth", "Kotak Overnight Fund - Regular Plan - Growth", "Kotak Pioneer Fund - Direct Plan - Growth", "Kotak Pioneer Fund - Regular Plan - Growth", "Kotak Savings Fund - Direct Plan - Growth", "Kotak Savings Fund - Regular Plan - Growth", "Kotak Short Term Fund - Direct Plan - Growth", "Kotak Short Term Fund - Regular Plan - Growth", "Kotak Small Cap Fund - Direct Plan - Growth", "Kotak Small Cap Fund - Regular Plan - Growth", "Kotak Tax Saver Fund - Direct Plan - Growth", "Kotak Tax Saver Fund - Regular Plan - Growth", "Kotak Technology Fund - Direct Plan - Growth", "Kotak Technology Fund - Regular Plan - Growth", "Kotak Ultra Short Duration Fund - Direct Plan - Growth", "Kotak Ultra Short Duration Fund - Regular Plan - Growth", "Kotak White Oak Global Equity Allocator FOF - Direct Plan - Growth", "Kotak White Oak Global Equity Allocator FOF - Regular Plan - Growth", "Mirae Asset Arbitrage Fund - Direct Plan - Growth", "Mirae Asset Arbitrage Fund - Regular Plan - Growth", "Mirae Asset Banking and PSU Debt Fund - Direct Plan - Growth", "Mirae Asset Banking and PSU Debt Fund - Regular Plan - Growth", "Mirae Asset Cash Management Fund - Direct Plan - Growth", "Mirae Asset Cash Management Fund - Regular Plan - Growth", "Mirae Asset Dynamic Bond Fund - Direct Plan - Growth", "Mirae Asset Dynamic Bond Fund - Regular Plan - Growth", "Mirae Asset ESG Sector Leaders ETF FOF - Direct Plan - Growth", "Mirae Asset Emerging Bluechip Fund - Direct Plan - Growth", "Mirae Asset Emerging Bluechip Fund - Regular Plan - Growth", "Mirae Asset Equity Allocator FOF - Direct Plan - Growth", "Mirae Asset Equity Allocator FOF - Regular Plan - Growth", "Mirae Asset Equity Savings Fund - Direct Plan - Growth", "Mirae Asset Equity Savings Fund - Regular Plan - Growth", "Mirae Asset Flexi Cap Fund - Direct Plan - Growth", "Mirae Asset Flexi Cap Fund - Regular Plan - Growth", "Mirae Asset Focused Fund - Direct Plan - Growth", "Mirae Asset Focused Fund - Regular Plan - Growth", "Mirae Asset Great Consumer Fund - Direct Plan - Growth", "Mirae Asset Great Consumer Fund - Regular Plan - Growth", "Mirae Asset Healthcare Fund - Direct Plan - Growth", "Mirae Asset Healthcare Fund - Regular Plan - Growth", "Mirae Asset Hybrid Equity Fund - Direct Plan - Growth", "Mirae Asset Hybrid Equity Fund - Regular Plan - Growth", "Mirae Asset Large & Midcap Fund - Direct Plan - Growth", "Mirae Asset Large & Midcap Fund - Regular Plan - Growth", "Mirae Asset Large Cap Fund - Direct Plan - Growth", "Mirae Asset Large Cap Fund - Regular Plan - Growth", "Mirae Asset Liquid Fund - Direct Plan - Growth", "Mirae Asset Liquid Fund - Regular Plan - Growth", "Mirae Asset Low Duration Fund - Direct Plan - Growth", "Mirae Asset Low Duration Fund - Regular Plan - Growth", "Mirae Asset Mid Cap Fund - Direct Plan - Growth", "Mirae Asset Mid Cap Fund - Regular Plan - Growth", "Mirae Asset Money Market Fund - Direct Plan - Growth", "Mirae Asset Money Market Fund - Regular Plan - Growth", "Mirae Asset Multi Asset Allocation Fund - Direct Plan - Growth", "Mirae Asset Multi Asset Allocation Fund - Regular Plan - Growth", "Mirae Asset Multicap Fund - Direct Plan - Growth", "Mirae Asset Multicap Fund - Regular Plan - Growth", "Mirae Asset Nifty 100 Low Volatility 30 ETF FOF - Direct Plan - Growth", "Mirae Asset Nifty 50 ETF FOF - Direct Plan - Growth", "Mirae Asset Nifty 50 ETF FOF - Regular Plan - Growth", "Mirae Asset Nifty 50 Index Fund - Direct Plan - Growth", "Mirae Asset Nifty 50 Index Fund - Regular Plan - Growth", "Mirae Asset Nifty Next 50 ETF FOF - Direct Plan - Growth", "Mirae Asset Nifty Smallcap 250 Momentum Quality 100 ETF FOF - Direct Plan - Growth", "Mirae Asset Overnight Fund - Direct Plan - Growth", "Mirae Asset Overnight Fund - Regular Plan - Growth", "Mirae Asset Savings Fund - Direct Plan - Growth", "Mirae Asset Savings Fund - Regular Plan - Growth", "Mirae Asset Short Duration Fund - Direct Plan - Growth", "Mirae Asset Short Duration Fund - Regular Plan - Growth", "Mirae Asset Small Cap Fund - Direct Plan - Growth", "Mirae Asset Small Cap Fund - Regular Plan - Growth", "Mirae Asset Tax Saver Fund - Direct Plan - Growth", "Mirae Asset Tax Saver Fund - Regular Plan - Growth", "Mirae Asset Ultra Short Duration Fund - Direct Plan - Growth", "Mirae Asset Ultra Short Duration Fund - Regular Plan - Growth", "Motilal Oswal Balanced Advantage Fund - Direct Plan - Growth", "Motilal Oswal Equity Hybrid Fund - Direct Plan - Growth", "Motilal Oswal Flexi Cap Fund - Direct Plan - Growth", "Motilal Oswal Flexi Cap Fund - Regular Plan - Growth", "Motilal Oswal Focused Fund - Direct Plan - Growth", "Motilal Oswal Focused Fund - Regular Plan - Growth", "Motilal Oswal Large Cap Fund - Direct Plan - Growth", "Motilal Oswal Large Cap Fund - Regular Plan - Growth", "Motilal Oswal Large and Midcap Fund - Direct Plan - Growth", "Motilal Oswal Large and Midcap Fund - Regular Plan - Growth", "Motilal Oswal Liquid Fund - Direct Plan - Growth", "Motilal Oswal Long Duration Fund - Direct Plan - Growth", "Motilal Oswal Midcap Fund - Direct Plan - Growth", "Motilal Oswal Midcap Fund - Regular Plan - Growth", "Motilal Oswal Money Market Fund - Direct Plan - Growth", "Motilal Oswal Multi Cap Fund - Direct Plan - Growth", "Motilal Oswal Multi Cap Fund - Regular Plan - Growth", "Motilal Oswal Nifty 200 Momentum 30 Index Fund - Direct Plan - Growth", "Motilal Oswal Nifty 50 Index Fund - Direct Plan - Growth", "Motilal Oswal Nifty 50 Index Fund - Regular Plan - Growth", "Motilal Oswal Nifty 500 Index Fund - Direct Plan - Growth", "Motilal Oswal Nifty Bank Index Fund - Direct Plan - Growth", "Motilal Oswal Nifty Midcap 150 Index Fund - Direct Plan - Growth", "Motilal Oswal Nifty Next 50 Index Fund - Direct Plan - Growth", "Motilal Oswal Nifty Smallcap 250 Index Fund - Direct Plan - Growth", "Motilal Oswal Overnight Fund - Direct Plan - Growth", "Motilal Oswal S&P 500 Index Fund - Direct Plan - Growth", "Motilal Oswal S&P 500 Index Fund - Regular Plan - Growth", "Motilal Oswal Small Cap Fund - Direct Plan - Growth", "Motilal Oswal Small Cap Fund - Regular Plan - Growth", "Motilal Oswal Ultra Short Term Fund - Direct Plan - Growth", "Motilal Oswal Value Fund - Direct Plan - Growth", "Navi ELSS Tax Saver Nifty 50 Index Fund - Direct Plan - Growth", "Navi Flexi Cap Fund - Direct Plan - Growth", "Navi Large & Midcap Fund - Direct Plan - Growth", "Navi Large Cap Fund - Direct Plan - Growth", "Navi Liquid Fund - Direct Plan - Growth", "Navi Nifty 50 Index Fund - Direct Plan - Growth", "Navi Nifty Bank Index Fund - Direct Plan - Growth", "Navi Nifty India Manufacturing Index Fund - Direct Plan - Growth", "Navi Nifty Midcap 150 Index Fund - Direct Plan - Growth", "Navi Nifty Next 50 Index Fund - Direct Plan - Growth", "Navi Nifty Smallcap 250 Index Fund - Direct Plan - Growth", "Navi Overnight Fund - Direct Plan - Growth", "Navi Regular Savings Fund - Direct Plan - Growth", "Navi Short Duration Fund - Direct Plan - Growth", "Navi Ultra Short Duration Fund - Direct Plan - Growth", "Nippon India Arbitrage Fund - Direct Plan - Growth", "Nippon India Arbitrage Fund - Regular Plan - Growth", "Nippon India Asset Allocator FOF - Direct Plan - Growth", "Nippon India Asset Allocator FOF - Regular Plan - Growth", "Nippon India Balanced Advantage Fund - Direct Plan - Growth", "Nippon India Balanced Advantage Fund - Regular Plan - Growth", "Nippon India Banking & PSU Debt Fund - Direct Plan - Growth", "Nippon India Banking & PSU Debt Fund - Regular Plan - Growth", "Nippon India Banking Fund - Direct Plan - Growth", "Nippon India Banking Fund - Regular Plan - Growth", "Nippon India Corporate Bond Fund - Direct Plan - Growth", "Nippon India Corporate Bond Fund - Regular Plan - Growth", "Nippon India Credit Risk Fund - Direct Plan - Growth", "Nippon India Credit Risk Fund - Regular Plan - Growth", "Nippon India Dynamic Bond Fund - Direct Plan - Growth", "Nippon India Dynamic Bond Fund - Regular Plan - Growth", "Nippon India ETF Nifty 50 BeES", "Nippon India Equity Hybrid Fund - Direct Plan - Growth", "Nippon India Equity Hybrid Fund - Regular Plan - Growth", "Nippon India Equity Savings Fund - Direct Plan - Growth", "Nippon India Equity Savings Fund - Regular Plan - Growth", "Nippon India Flexi Cap Fund - Direct Plan - Growth", "Nippon India Flexi Cap Fund - Regular Plan - Growth", "Nippon India Focused Equity Fund - Direct Plan - Growth", "Nippon India Focused Equity Fund - Regular Plan - Growth", "Nippon India Gilt Securities Fund - Direct Plan - Growth", "Nippon India Gilt Securities Fund - Regular Plan - Growth", "Nippon India Growth Fund - Direct Plan - Growth", "Nippon India Growth Fund - Regular Plan - Growth", "Nippon India Index Fund - Nifty 50 Plan - Direct Plan - Growth", "Nippon India Index Fund - Nifty 50 Plan - Regular Plan - Growth", "Nippon India Index Fund - Sensex Plan - Direct Plan - Growth", "Nippon India Index Fund - Sensex Plan - Regular Plan - Growth", "Nippon India Large Cap Fund - Direct Plan - Growth", "Nippon India Large Cap Fund - Regular Plan - Growth", "Nippon India Liquid Fund - Direct Plan - Growth", "Nippon India Liquid Fund - Regular Plan - Growth", "Nippon India Low Duration Fund - Direct Plan - Growth", "Nippon India Low Duration Fund - Regular Plan - Growth", "Nippon India Money Market Fund - Direct Plan - Growth", "Nippon India Money Market Fund - Regular Plan - Growth", "Nippon India Multi Asset Fund - Direct Plan - Growth", "Nippon India Multi Asset Fund - Regular Plan - Growth", "Nippon India Multicap Fund - Direct Plan - Growth", "Nippon India Multicap Fund - Regular Plan - Growth", "Nippon India Nifty Midcap 150 Index Fund - Direct Plan - Growth", "Nippon India Nifty Next 50 Junior BeES FOF - Direct Plan - Growth", "Nippon India Nifty SmallCap 250 Index Fund - Direct Plan - Growth", "Nippon India Overnight Fund - Direct Plan - Growth", "Nippon India Overnight Fund - Regular Plan - Growth", "Nippon India Power & Infra Fund - Direct Plan - Growth", "Nippon India Power & Infra Fund - Regular Plan - Growth", "Nippon India Retirement Fund - Income Generation Scheme - Direct Plan - Growth", "Nippon India Retirement Fund - Wealth Creation Scheme - Direct Plan - Growth", "Nippon India Short Duration Fund - Direct Plan - Growth", "Nippon India Short Duration Fund - Regular Plan - Growth", "Nippon India Small Cap Fund - Direct Plan - Growth", "Nippon India Small Cap Fund - Regular Plan - Growth", "Nippon India Tax Saver (ELSS) Fund - Direct Plan - Growth", "Nippon India Tax Saver (ELSS) Fund - Regular Plan - Growth", "Nippon India Ultra Short Duration Fund - Direct Plan - Growth", "Nippon India Ultra Short Duration Fund - Regular Plan - Growth", "Nippon India Value Fund - Direct Plan - Growth", "Nippon India Value Fund - Regular Plan - Growth", "PGIM India Arbitrage Fund - Direct Plan - Growth", "PGIM India Arbitrage Fund - Regular Plan - Growth", "PGIM India Balanced Advantage Fund - Direct Plan - Growth", "PGIM India Balanced Advantage Fund - Regular Plan - Growth", "PGIM India Corporate Bond Fund - Direct Plan - Growth", "PGIM India Dynamic Bond Fund - Direct Plan - Growth", "PGIM India ELSS Tax Saver Fund - Direct Plan - Growth", "PGIM India ELSS Tax Saver Fund - Regular Plan - Growth", "PGIM India Equity Savings Fund - Direct Plan - Growth", "PGIM India Flexi Cap Fund - Direct Plan - Growth", "PGIM India Flexi Cap Fund - Regular Plan - Growth", "PGIM India Global Equity Opportunities Fund - Direct Plan - Growth", "PGIM India Hybrid Equity Fund - Direct Plan - Growth", "PGIM India Large Cap Fund - Direct Plan - Growth", "PGIM India Large Cap Fund - Regular Plan - Growth", "PGIM India Liquid Fund - Direct Plan - Growth", "PGIM India Liquid Fund - Regular Plan - Growth", "PGIM India Low Duration Fund - Direct Plan - Growth", "PGIM India Mid Cap Opportunities Fund - Direct Plan - Growth", "PGIM India Mid Cap Opportunities Fund - Regular Plan - Growth", "PGIM India Money Market Fund - Direct Plan - Growth", "PGIM India Multi Cap Fund - Direct Plan - Growth", "PGIM India Overnight Fund - Direct Plan - Growth", "PGIM India Short Duration Fund - Direct Plan - Growth", "PGIM India Small Cap Fund - Direct Plan - Growth", "PGIM India Small Cap Fund - Regular Plan - Growth", "PGIM India Ultra Short Duration Fund - Direct Plan - Growth", "Parag Parikh Conservative Hybrid Fund - Direct Plan - Growth", "Parag Parikh Conservative Hybrid Fund - Regular Plan - Growth", "Parag Parikh Dynamic Asset Allocation Fund - Direct Plan - Growth", "Parag Parikh Dynamic Asset Allocation Fund - Regular Plan - Growth", "Parag Parikh ELSS Tax Saver Fund - Direct Plan - Growth", "Parag Parikh ELSS Tax Saver Fund - Regular Plan - Growth", "Parag Parikh Equity Savings Fund - Direct Plan - Growth", "Parag Parikh Equity Savings Fund - Regular Plan - Growth", "Parag Parikh Flexi Cap Fund - Direct Plan - Growth", "Parag Parikh Flexi Cap Fund - Regular Plan - Growth", "Parag Parikh Liquid Fund - Direct Plan - Growth", "Parag Parikh Liquid Fund - Regular Plan - Growth", "Parag Parikh Overnight Fund - Direct Plan - Growth", "Parag Parikh Overnight Fund - Regular Plan - Growth", "Quant Absolute Fund - Direct Plan - Growth", "Quant Active Fund - Direct Plan - Growth", "Quant Active Fund - Regular Plan - Growth", "Quant Arbitrage Fund - Direct Plan - Growth", "Quant Balanced Advantage Fund - Direct Plan - Growth", "Quant Business Cycle Fund - Direct Plan - Growth", "Quant Consumption Fund - Direct Plan - Growth", "Quant Dynamic Asset Allocation Fund - Direct Plan - Growth", "Quant ELSS Tax Saver Fund - Direct Plan - Growth", "Quant ELSS Tax Saver Fund - Regular Plan - Growth", "Quant ESG Equity Fund - Direct Plan - Growth", "Quant Equity Savings Fund - Direct Plan - Growth", "Quant Flexi Cap Fund - Direct Plan - Growth", "Quant Focused Fund - Direct Plan - Growth", "Quant Gilt Fund - Direct Plan - Growth", "Quant Healthcare Fund - Direct Plan - Growth", "Quant Infrastructure Fund - Direct Plan - Growth", "Quant Large & Mid Cap Fund - Direct Plan - Growth", "Quant Large Cap Fund - Direct Plan - Growth", "Quant Large Cap Fund - Regular Plan - Growth", "Quant Liquid Fund - Direct Plan - Growth", "Quant Mid Cap Fund - Direct Plan - Growth", "Quant Mid Cap Fund - Regular Plan - Growth", "Quant Money Market Fund - Direct Plan - Growth", "Quant Multi Asset Fund - Direct Plan - Growth", "Quant Multi Cap Fund - Direct Plan - Growth", "Quant Nifty 50 ETF FOF - Direct Plan - Growth", "Quant Nifty 50 Index Fund - Direct Plan - Growth", "Quant Overnight Fund - Direct Plan - Growth", "Quant PSU Fund - Direct Plan - Growth", "Quant Quantamental Fund - Direct Plan - Growth", "Quant Small Cap Fund - Direct Plan - Growth", "Quant Small Cap Fund - Regular Plan - Growth", "Quant Technology Fund - Direct Plan - Growth", "Quant Value Fund - Direct Plan - Growth", "SBI Balanced Advantage Fund - Direct Plan - Growth", "SBI Balanced Advantage Fund - Regular Plan - Growth", "SBI Banking & Financial Services Fund - Direct Plan - Growth", "SBI Banking & Financial Services Fund - Regular Plan - Growth", "SBI Blue Chip Fund - Direct Plan - Growth", "SBI Blue Chip Fund - Regular Plan - Growth", "SBI Conservative Hybrid Fund - Direct Plan - Growth", "SBI Conservative Hybrid Fund - Regular Plan - Growth", "SBI Consumption Opportunities Fund - Direct Plan - Growth", "SBI Consumption Opportunities Fund - Regular Plan - Growth", "SBI Contra Fund - Direct Plan - Growth", "SBI Contra Fund - Regular Plan - Growth", "SBI Corporate Bond Fund - Direct Plan - Growth", "SBI Corporate Bond Fund - Regular Plan - Growth", "SBI Credit Risk Fund - Direct Plan - Growth", "SBI Credit Risk Fund - Regular Plan - Growth", "SBI Dynamic Asset Allocation Fund - Direct Plan - Growth", "SBI Dynamic Asset Allocation Fund - Regular Plan - Growth", "SBI Dynamic Bond Fund - Direct Plan - Growth", "SBI Dynamic Bond Fund - Regular Plan - Growth", "SBI ESG Exclusionary Strategy Fund - Direct Plan - Growth", "SBI ESG Exclusionary Strategy Fund - Regular Plan - Growth", "SBI Equity Hybrid Fund - Direct Plan - Growth", "SBI Equity Hybrid Fund - Regular Plan - Growth", "SBI Flexi Cap Fund - Direct Plan - Growth", "SBI Flexi Cap Fund - Regular Plan - Growth", "SBI Focused Equity Fund - Direct Plan - Growth", "SBI Focused Equity Fund - Regular Plan - Growth", "SBI Healthcare Opportunities Fund - Direct Plan - Growth", "SBI Healthcare Opportunities Fund - Regular Plan - Growth", "SBI Large & Midcap Fund - Direct Plan - Growth", "SBI Large & Midcap Fund - Regular Plan - Growth", "SBI Large Cap Fund - Direct Plan - Growth", "SBI Large Cap Fund - Regular Plan - Growth", "SBI Liquid Fund - Direct Plan - Growth", "SBI Liquid Fund - Regular Plan - Growth", "SBI Long Term Equity Fund - Direct Plan - Growth", "SBI Long Term Equity Fund - Regular Plan - Growth", "SBI Magnum Children's Benefit Fund - Investment Plan - Direct Plan - Growth", "SBI Magnum Children's Benefit Fund - Investment Plan - Regular Plan - Growth", "SBI Magnum Gilt Fund - Direct Plan - Growth", "SBI Magnum Gilt Fund - Regular Plan - Growth", "SBI Magnum Income Fund - Direct Plan - Growth", "SBI Magnum Income Fund - Regular Plan - Growth", "SBI Magnum Low Duration Fund - Direct Plan - Growth", "SBI Magnum Low Duration Fund - Regular Plan - Growth", "SBI Magnum Medium Duration Fund - Direct Plan - Growth", "SBI Magnum Medium Duration Fund - Regular Plan - Growth", "SBI Magnum Midcap Fund - Direct Plan - Growth", "SBI Magnum Midcap Fund - Regular Plan - Growth", "SBI Magnum Ultra Short Duration Fund - Direct Plan - Growth", "SBI Magnum Ultra Short Duration Fund - Regular Plan - Growth", "SBI Multi Asset Allocation Fund - Direct Plan - Growth", "SBI Multi Asset Allocation Fund - Regular Plan - Growth", "SBI Multicap Fund - Direct Plan - Growth", "SBI Multicap Fund - Regular Plan - Growth", "SBI Nifty 50 ETF", "SBI Nifty Index Fund - Direct Plan - Growth", "SBI Nifty Index Fund - Regular Plan - Growth", "SBI Nifty Next 50 Index Fund - Direct Plan - Growth", "SBI Nifty Next 50 Index Fund - Regular Plan - Growth", "SBI Overnight Fund - Direct Plan - Growth", "SBI Overnight Fund - Regular Plan - Growth", "SBI PSU Fund - Direct Plan - Growth", "SBI PSU Fund - Regular Plan - Growth", "SBI Short Term Debt Fund - Direct Plan - Growth", "SBI Short Term Debt Fund - Regular Plan - Growth", "SBI Small Cap Fund - Direct Plan - Growth", "SBI Small Cap Fund - Regular Plan - Growth", "SBI Technology Opportunities Fund - Direct Plan - Growth", "SBI Technology Opportunities Fund - Regular Plan - Growth", "Sundaram Arbitrage Fund - Direct Plan - Growth", "Sundaram Balanced Advantage Fund - Direct Plan - Growth", "Sundaram Banking & PSU Debt Fund - Direct Plan - Growth", "Sundaram Consumption Fund - Direct Plan - Growth", "Sundaram Corporate Bond Fund - Direct Plan - Growth", "Sundaram Diversified Equity Fund - Direct Plan - Growth", "Sundaram Dividend Yield Fund - Direct Plan - Growth", "Sundaram ELSS Tax Saver Fund - Direct Plan - Growth", "Sundaram Equity Hybrid Fund - Direct Plan - Growth", "Sundaram Financial Services Opportunities Fund - Direct Plan - Growth", "Sundaram Flexi Cap Fund - Direct Plan - Growth", "Sundaram Focused Fund - Direct Plan - Growth", "Sundaram Infrastructure Advantage Fund - Direct Plan - Growth", "Sundaram Large & Mid Cap Fund - Direct Plan - Growth", "Sundaram Large Cap Fund - Direct Plan - Growth", "Sundaram Liquid Fund - Direct Plan - Growth", "Sundaram Low Duration Fund - Direct Plan - Growth", "Sundaram Mid Cap Fund - Direct Plan - Growth", "Sundaram Money Market Fund - Direct Plan - Growth", "Sundaram Multi Asset Allocation Fund - Direct Plan - Growth", "Sundaram Multicap Fund - Direct Plan - Growth", "Sundaram Nifty 100 Equal Wgt Fund - Direct Plan - Growth", "Sundaram Overnight Fund - Direct Plan - Growth", "Sundaram Rural and Consumption Fund - Direct Plan - Growth", "Sundaram Short Duration Fund - Direct Plan - Growth", "Sundaram Small Cap Fund - Direct Plan - Growth", "Sundaram Ultra Short Duration Fund - Direct Plan - Growth", "Tata Arbitrage Fund - Direct Plan - Growth", "Tata Arbitrage Fund - Regular Plan - Growth", "Tata Balanced Advantage Fund - Direct Plan - Growth", "Tata Balanced Advantage Fund - Regular Plan - Growth", "Tata Banking & PSU Debt Fund - Direct Plan - Growth", "Tata Banking & PSU Debt Fund - Regular Plan - Growth", "Tata Business Cycle Fund - Direct Plan - Growth", "Tata Business Cycle Fund - Regular Plan - Growth", "Tata Corporate Bond Fund - Direct Plan - Growth", "Tata Corporate Bond Fund - Regular Plan - Growth", "Tata Digital India Fund - Direct Plan - Growth", "Tata Digital India Fund - Regular Plan - Growth", "Tata Dividend Yield Fund - Direct Plan - Growth", "Tata Dividend Yield Fund - Regular Plan - Growth", "Tata Dynamic Bond Fund - Direct Plan - Growth", "Tata Dynamic Bond Fund - Regular Plan - Growth", "Tata Equity P/E Fund - Direct Plan - Growth", "Tata Equity P/E Fund - Regular Plan - Growth", "Tata Equity Savings Fund - Direct Plan - Growth", "Tata Equity Savings Fund - Regular Plan - Growth", "Tata Flexi Cap Fund - Direct Plan - Growth", "Tata Flexi Cap Fund - Regular Plan - Growth", "Tata Focused Equity Fund - Direct Plan - Growth", "Tata Focused Equity Fund - Regular Plan - Growth", "Tata Gilt Securities Fund - Direct Plan - Growth", "Tata Gilt Securities Fund - Regular Plan - Growth", "Tata Hybrid Equity Fund - Direct Plan - Growth", "Tata Hybrid Equity Fund - Regular Plan - Growth", "Tata Index Fund Nifty 50 - Direct Plan - Growth", "Tata Index Fund Nifty 50 - Regular Plan - Growth", "Tata India Consumer Fund - Direct Plan - Growth", "Tata India Consumer Fund - Regular Plan - Growth", "Tata India Pharma & Healthcare Fund - Direct Plan - Growth", "Tata India Pharma & Healthcare Fund - Regular Plan - Growth", "Tata Infrastructure Fund - Direct Plan - Growth", "Tata Infrastructure Fund - Regular Plan - Growth", "Tata Large & Mid Cap Fund - Direct Plan - Growth", "Tata Large & Mid Cap Fund - Regular Plan - Growth", "Tata Large Cap Fund - Direct Plan - Growth", "Tata Large Cap Fund - Regular Plan - Growth", "Tata Liquid Fund - Direct Plan - Growth", "Tata Liquid Fund - Regular Plan - Growth", "Tata Long Duration Fund - Direct Plan - Growth", "Tata Long Duration Fund - Regular Plan - Growth", "Tata Mid Cap Growth Fund - Direct Plan - Growth", "Tata Mid Cap Growth Fund - Regular Plan - Growth", "Tata Money Market Fund - Direct Plan - Growth", "Tata Money Market Fund - Regular Plan - Growth", "Tata Multi Asset Opportunities Fund - Direct Plan - Growth", "Tata Multi Asset Opportunities Fund - Regular Plan - Growth", "Tata Multicap Fund - Direct Plan - Growth", "Tata Multicap Fund - Regular Plan - Growth", "Tata Nifty 50 Index Fund - Direct Plan - Growth", "Tata Nifty India Digital ETF FOF - Direct Plan - Growth", "Tata Nifty Private Bank ETF FOF - Direct Plan - Growth", "Tata Overnight Fund - Direct Plan - Growth", "Tata Overnight Fund - Regular Plan - Growth", "Tata Resources & Energy Fund - Direct Plan - Growth", "Tata Resources & Energy Fund - Regular Plan - Growth", "Tata Retirement Savings Fund - Moderate Plan - Direct Plan - Growth", "Tata Retirement Savings Fund - Progressive Plan - Direct Plan - Growth", "Tata Short Term Bond Fund - Direct Plan - Growth", "Tata Short Term Bond Fund - Regular Plan - Growth", "Tata Small Cap Fund - Direct Plan - Growth", "Tata Small Cap Fund - Regular Plan - Growth", "Tata Tax Saving Fund - Direct Plan - Growth", "Tata Tax Saving Fund - Regular Plan - Growth", "Tata Ultra Short Term Fund - Direct Plan - Growth", "Tata Ultra Short Term Fund - Regular Plan - Growth", "UTI Arbitrage Fund - Direct Plan - Growth", "UTI Arbitrage Fund - Regular Plan - Growth", "UTI Balanced Advantage Fund - Direct Plan - Growth", "UTI Balanced Advantage Fund - Regular Plan - Growth", "UTI Banking & PSU Fund - Direct Plan - Growth", "UTI Banking & PSU Fund - Regular Plan - Growth", "UTI Bond Fund - Direct Plan - Growth", "UTI Bond Fund - Regular Plan - Growth", "UTI Children's Career Fund - Direct Plan - Growth", "UTI Children's Career Fund - Regular Plan - Growth", "UTI Corporate Bond Fund - Direct Plan - Growth", "UTI Corporate Bond Fund - Regular Plan - Growth", "UTI Credit Risk Fund - Direct Plan - Growth", "UTI Credit Risk Fund - Regular Plan - Growth", "UTI Dynamic Bond Fund - Direct Plan - Growth", "UTI Dynamic Bond Fund - Regular Plan - Growth", "UTI Equity Fund - Direct Plan - Growth", "UTI Equity Fund - Regular Plan - Growth", "UTI Equity Savings Fund - Direct Plan - Growth", "UTI Equity Savings Fund - Regular Plan - Growth", "UTI Flexi Cap Fund - Direct Plan - Growth", "UTI Flexi Cap Fund - Regular Plan - Growth", "UTI Focused Fund - Direct Plan - Growth", "UTI Focused Fund - Regular Plan - Growth", "UTI Gilt Fund - Direct Plan - Growth", "UTI Gilt Fund - Regular Plan - Growth", "UTI Gold ETF FOF - Direct Plan - Growth", "UTI Gold ETF FOF - Regular Plan - Growth", "UTI Healthcare Fund - Direct Plan - Growth", "UTI Healthcare Fund - Regular Plan - Growth", "UTI Hybrid Equity Fund - Direct Plan - Growth", "UTI Hybrid Equity Fund - Regular Plan - Growth", "UTI Large & Mid Cap Fund - Direct Plan - Growth", "UTI Large & Mid Cap Fund - Regular Plan - Growth", "UTI Liquid Cash Plan - Direct Plan - Growth", "UTI Liquid Cash Plan - Regular Plan - Growth", "UTI Long Duration Fund - Direct Plan - Growth", "UTI Long Duration Fund - Regular Plan - Growth", "UTI Low Duration Fund - Direct Plan - Growth", "UTI Low Duration Fund - Regular Plan - Growth", "UTI Master Value Fund - Direct Plan - Growth", "UTI Master Value Fund - Regular Plan - Growth", "UTI Medium Duration Fund - Direct Plan - Growth", "UTI Medium Duration Fund - Regular Plan - Growth", "UTI Mid Cap Fund - Direct Plan - Growth", "UTI Mid Cap Fund - Regular Plan - Growth", "UTI Money Market Fund - Direct Plan - Growth", "UTI Money Market Fund - Regular Plan - Growth", "UTI Multi Asset Allocation Fund - Direct Plan - Growth", "UTI Multi Asset Allocation Fund - Regular Plan - Growth", "UTI Multicap Fund - Direct Plan - Growth", "UTI Multicap Fund - Regular Plan - Growth", "UTI Nifty 200 Momentum 30 Index Fund - Direct Plan - Growth", "UTI Nifty 50 ETF", "UTI Nifty 50 Index Fund - Direct Plan - Growth", "UTI Nifty 50 Index Fund - Regular Plan - Growth", "UTI Nifty Next 50 Index Fund - Direct Plan - Growth", "UTI Nifty Next 50 Index Fund - Regular Plan - Growth", "UTI Overnight Fund - Direct Plan - Growth", "UTI Overnight Fund - Regular Plan - Growth", "UTI Regular Savings Fund - Direct Plan - Growth", "UTI Regular Savings Fund - Regular Plan - Growth", "UTI Retirement Benefit Pension Fund - Direct Plan - Growth", "UTI Retirement Benefit Pension Fund - Regular Plan - Growth", "UTI Sensex ETF", "UTI Short Duration Fund - Direct Plan - Growth", "UTI Short Duration Fund - Regular Plan - Growth", "UTI Small Cap Fund - Direct Plan - Growth", "UTI Small Cap Fund - Regular Plan - Growth", "UTI Transportation and Logistics Fund - Direct Plan - Growth", "UTI Transportation and Logistics Fund - Regular Plan - Growth", "UTI Ultra Short Term Fund - Direct Plan - Growth", "UTI Ultra Short Term Fund - Regular Plan - Growth", "UTI Unit Linked Insurance Plan", "WhiteOak Capital Arbitrage Fund - Direct Plan - Growth", "WhiteOak Capital Balanced Advantage Fund - Direct Plan - Growth", "WhiteOak Capital Banking & Financial Services Fund - Direct Plan - Growth", "WhiteOak Capital Dynamic Bond Fund - Direct Plan - Growth", "WhiteOak Capital ELSS Tax Saver Fund - Direct Plan - Growth", "WhiteOak Capital Equity Savings Fund - Direct Plan - Growth", "WhiteOak Capital Flexi Cap Fund - Direct Plan - Growth", "WhiteOak Capital Flexi Cap Fund - Regular Plan - Growth", "WhiteOak Capital Focused Fund - Direct Plan - Growth", "WhiteOak Capital Large & Mid Cap Fund - Direct Plan - Growth", "WhiteOak Capital Large Cap Fund - Direct Plan - Growth", "WhiteOak Capital Liquid Fund - Direct Plan - Growth", "WhiteOak Capital Mid Cap Fund - Direct Plan - Growth", "WhiteOak Capital Multi Asset Allocation Fund - Direct Plan - Growth", "WhiteOak Capital Multicap Fund - Direct Plan - Growth", "WhiteOak Capital Overnight Fund - Direct Plan - Growth", "WhiteOak Capital Short Duration Fund - Direct Plan - Growth", "WhiteOak Capital Small Cap Fund - Direct Plan - Growth"];

// ── Scoring engine ──
function scoreAnswers(answers) {
  const scores = {};
  let total = 0;

  // Q2 Age score (younger = more time = higher equity tolerance)
  const age = parseInt(answers.q2);
  const ageScore = age <= 30 ? 10 : age <= 40 ? 8 : age <= 50 ? 6 : age <= 60 ? 4 : 2;
  scores.age = ageScore;

  // Q4 Horizon
  const horizon = parseInt(answers.q4);
  const horizonScore = horizon >= 15 ? 10 : horizon >= 10 ? 8 : horizon >= 7 ? 6 : horizon >= 5 ? 4 : 2;
  scores.horizon = horizonScore;

  // Q5 Mode
  const modeMap = { "SIP only": 10, "Both (lump sum now + ongoing SIP)": 8, "Lump sum only": 5 };
  scores.mode = modeMap[answers.q5] || 5;

  // Q6 Portfolio
  const portMap = {
    "Yes — diversified portfolio of multiple funds or assets": 10,
    "Yes — mostly in one or two funds": 6,
    "No — this would be my first or only equity investment": 7,
    "I hold primarily debt or fixed income currently": 4,
  };
  scores.portfolio = portMap[answers.q6] || 5;

  // Q7 Risk & Volatility (merged)
  const riskVolMap = {
    "Conservative": 2,
    "Moderate": 5,
    "Aggressive": 8,
    "Very Aggressive": 10,
  };
  scores.riskVol = riskVolMap[answers.q7] || 5;

  // Q8 Tax (was Q9)
  const taxMap = {
    "30% bracket — tax efficiency matters a lot": 4,
    "20% bracket — moderate concern": 6,
    "5–10% bracket or exempt — minimal impact": 9,
    "Not sure": 6,
  };
  scores.tax = taxMap[answers.q8] || 5;

  const weights = { age: 0.15, horizon: 0.20, mode: 0.10, portfolio: 0.10, riskVol: 0.35, tax: 0.10 };
  Object.keys(weights).forEach(k => { total += (scores[k] || 0) * weights[k]; });
  const finalScore = Math.round(total * 10) / 10;

  // Investor profile
  let profile, profileDesc, color;
  if (finalScore >= 8) {
    profile = "Aggressive Growth"; color = "#22c55e";
    profileDesc = "You have a high capacity for risk and a long runway. Equity-heavy funds with small/mid-cap exposure suit you well.";
  } else if (finalScore >= 6.5) {
    profile = "Growth Oriented"; color = "#84cc16";
    profileDesc = "You seek growth with moderate risk tolerance. Diversified equity and flexi-cap funds are your sweet spot.";
  } else if (finalScore >= 5) {
    profile = "Balanced"; color = "#eab308";
    profileDesc = "You balance growth and stability. Hybrid or balanced advantage funds align with your temperament.";
  } else if (finalScore >= 3.5) {
    profile = "Conservative Growth"; color = "#f97316";
    profileDesc = "Capital preservation matters to you. Conservative hybrid or short-duration debt funds are suitable.";
  } else {
    profile = "Capital Preservation"; color = "#ef4444";
    profileDesc = "Protecting your capital is the priority. Debt funds, liquid funds, or fixed income instruments are most appropriate.";
  }

  // Recommendation
  const fund = answers.q1;
  const isMidSmall = /mid|small/i.test(fund);
  const isDebt = /debt|bond|gilt|liquid|overnight|short|money market|credit|duration/i.test(fund);
  const isIndex = /index|nifty|sensex|etf/i.test(fund);
  const isHybrid = /hybrid|balanced|equity saver|multi asset/i.test(fund);

  let recommendation, recReason, recColor;
  const goalStr = answers.q3 || "";
  const contextStr = answers.q9 || "";
  const isFirstTime = contextStr.includes("First-time");
  const isExiting = contextStr.includes("exit");

  if (isDebt && finalScore >= 6) {
    recommendation = "HOLD / REVIEW";
    recColor = "#eab308";
    recReason = "This is a debt fund but your profile supports higher equity allocation. Consider if this aligns with your " + goalStr.toLowerCase() + " goal.";
  } else if (isMidSmall && finalScore < 5) {
    recommendation = "AVOID / EXIT";
    recColor = "#ef4444";
    recReason = "Mid/small cap funds carry high volatility which conflicts with your conservative risk profile. Consider large-cap or hybrid alternatives.";
  } else if (isIndex && finalScore >= 5) {
    recommendation = "BUY / ACCUMULATE";
    recColor = "#22c55e";
    recReason = "Index funds offer low-cost, diversified market exposure. Given your profile, this is a solid core holding.";
  } else if (isHybrid && finalScore >= 4 && finalScore <= 7) {
    recommendation = "BUY / ACCUMULATE";
    recColor = "#22c55e";
    recReason = "Hybrid funds balance equity and debt dynamically — well-matched to your balanced profile.";
  } else if (finalScore >= 7 && !isDebt) {
    recommendation = "BUY / ACCUMULATE";
    recColor = "#22c55e";
    recReason = "Your aggressive growth profile and long horizon make this equity fund a suitable choice for wealth creation.";
  } else if (isExiting) {
    recommendation = "HOLD — Monitor";
    recColor = "#eab308";
    recReason = "Your profile suggests staying invested. Review performance against category peers before deciding to exit.";
  } else if (isFirstTime && finalScore >= 5) {
    recommendation = "BUY";
    recColor = "#22c55e";
    recReason = "A solid first investment aligned with your profile. Start with SIP mode to average out entry cost.";
  } else {
    recommendation = "HOLD / REVIEW";
    recColor = "#eab308";
    recReason = "Your profile and fund type are broadly aligned. Review expense ratio and 3-year rolling returns against category average before committing.";
  }

  // Tax note
  let taxNote = "";
  if (answers.q8?.includes("30%")) {
    const isElss = /elss|tax saver|tax saving/i.test(fund);
    const isEquityFund = !isDebt;
    taxNote = isElss
      ? "ELSS funds qualify for Section 80C deduction up to ₹1.5L — tax-efficient for your 30% bracket."
      : isEquityFund
      ? "For your 30% bracket, LTCG > ₹1.25L is taxed at 12.5%. Consider tax harvesting annually."
      : "Debt fund gains are taxed as per your slab (30%). Consider tax-free alternatives or ELSS.";
  } else if (answers.q8?.includes("20%")) {
    taxNote = "At 20% slab, equity LTCG above ₹1.25L is taxed at 12.5%. Debt fund gains are slab-taxed.";
  }

  // SIP projection (simplified)
  const monthlySIP = 10000;
  const rate = finalScore >= 7 ? 0.13 : finalScore >= 5 ? 0.11 : 0.08;
  const months = horizon * 12;
  const sipFV = monthlySIP * (((Math.pow(1 + rate/12, months) - 1) / (rate/12)) * (1 + rate/12));
  const invested = monthlySIP * months;
  const gains = sipFV - invested;

  return {
    scores, finalScore, profile, profileDesc, color,
    recommendation, recReason, recColor, taxNote,
    projection: { monthlySIP, rate, horizon, fv: Math.round(sipFV), invested: Math.round(invested), gains: Math.round(gains) }
  };
}

// ── Icons ──
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const Search = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const X = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Fund Search Component ──
function FundSearch({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [focused, setFocused] = useState(-1);
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const debRef = useRef(null);

  useEffect(() => {
    clearTimeout(debRef.current);
    if (query.length < 1) { setMatches([]); setOpen(false); return; }
    debRef.current = setTimeout(() => {
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const m = ALL_FUNDS.filter(f => words.every(w => f.toLowerCase().includes(w)));
      setMatches(m.slice(0, 80));
      setOpen(true);
      setFocused(-1);
    }, 150);
  }, [query]);

  const pick = useCallback((name) => {
    onChange(name);
    setQuery("");
    setOpen(false);
  }, [onChange]);

  const clear = () => { onChange(""); setQuery(""); inputRef.current?.focus(); };

  const handleKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setFocused(f => Math.min(f + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (focused >= 0) pick(matches[focused]); else if (matches.length === 1) pick(matches[0]); }
    else if (e.key === "Escape") setOpen(false);
  };

  useEffect(() => {
    if (focused >= 0 && dropRef.current) {
      const el = dropRef.current.children[focused];
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [focused]);

  const highlight = (text, q) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase().split(" ")[0]);
    if (idx === -1) return text;
    const word = q.split(" ")[0];
    return <>{text.slice(0, idx)}<mark style={{background:"rgba(212,160,23,0.3)",color:"#d4a017",borderRadius:"2px"}}>{text.slice(idx, idx + word.length)}</mark>{text.slice(idx + word.length)}</>;
  };

  return (
    <div style={{position:"relative"}}>
      <div style={{fontSize:"11px",color:"#d4a017",fontWeight:"500",marginBottom:"10px",letterSpacing:"0.5px"}}>
        {ALL_FUNDS.length.toLocaleString()} funds available
      </div>
      {value ? (
        <div style={{display:"flex",alignItems:"flex-start",gap:"10px",background:"rgba(212,160,23,0.08)",border:"1.5px solid rgba(212,160,23,0.4)",borderRadius:"10px",padding:"12px 14px"}}>
          <div style={{flex:1,fontSize:"14px",fontWeight:"500",color:"#f5f0e8",lineHeight:"1.45"}}>{value}</div>
          <button onClick={clear} style={{background:"none",border:"none",color:"#8a8278",cursor:"pointer",padding:"2px",borderRadius:"4px",flexShrink:0,display:"flex",alignItems:"center"}}><X/></button>
        </div>
      ) : (
        <>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:"#8a8278",pointerEvents:"none",display:"flex"}}><Search/></div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder="Type fund name — e.g. HDFC Mid Cap, Parag Parikh..."
              style={{
                width:"100%",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",
                padding:"12px 14px 12px 40px",fontFamily:"inherit",fontSize:"14px",
                color:"#f5f0e8",background:"rgba(255,255,255,0.05)",outline:"none",
                transition:"border-color .2s,box-shadow .2s",boxSizing:"border-box"
              }}
              onFocus={e => { e.target.style.borderColor="rgba(212,160,23,0.6)"; e.target.style.boxShadow="0 0 0 3px rgba(212,160,23,0.12)"; }}
              onBlurCapture={e => { e.target.style.borderColor="rgba(255,255,255,0.1)"; e.target.style.boxShadow="none"; }}
            />
          </div>
          {open && matches.length > 0 && (
            <div ref={dropRef} style={{
              position:"absolute",top:"calc(100% + 6px)",left:0,right:0,
              background:"#1a1a2e",border:"1.5px solid rgba(255,255,255,0.1)",
              borderRadius:"10px",maxHeight:"240px",overflowY:"auto",zIndex:999,
              boxShadow:"0 16px 48px rgba(0,0,0,0.5)"
            }}>
              {matches.map((f, i) => (
                <div key={i} onMouseDown={() => pick(f)}
                  style={{
                    padding:"10px 14px",fontSize:"13px",color: i === focused ? "#d4a017" : "#c8c0b4",
                    cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",
                    background: i === focused ? "rgba(212,160,23,0.08)" : "transparent",
                    lineHeight:"1.4",transition:"background .1s"
                  }}
                  onMouseEnter={() => setFocused(i)}
                >{highlight(f, query)}</div>
              ))}
              {ALL_FUNDS.filter(f => query.toLowerCase().split(" ").every(w => f.toLowerCase().includes(w))).length > 80 && (
                <div style={{padding:"10px 14px",fontSize:"12px",color:"#8a8278",textAlign:"center"}}>
                  Showing 80 of many results — type more to narrow
                </div>
              )}
            </div>
          )}
          {open && query.length > 1 && matches.length === 0 && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#1a1a2e",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"14px",fontSize:"13px",color:"#8a8278",textAlign:"center",zIndex:999}}>
              No funds matched. Try a different keyword.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Radio Option ──
function RadioOption({ name, value, label, selected, onChange }) {
  return (
    <label onClick={() => onChange(value)} style={{
      display:"flex",alignItems:"flex-start",gap:"12px",
      padding:"12px 16px",border:`1.5px solid ${selected ? "rgba(212,160,23,0.5)" : "rgba(255,255,255,0.08)"}`,
      borderRadius:"10px",cursor:"pointer",
      background: selected ? "rgba(212,160,23,0.07)" : "rgba(255,255,255,0.02)",
      boxShadow: selected ? "0 0 0 3px rgba(212,160,23,0.08)" : "none",
      transition:"all .18s",fontSize:"14px",color: selected ? "#f5f0e8" : "#a09890",lineHeight:"1.5"
    }}
    onMouseEnter={e => { if(!selected) e.currentTarget.style.borderColor="rgba(212,160,23,0.25)"; }}
    onMouseLeave={e => { if(!selected) e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}
    >
      <div style={{
        width:"18px",height:"18px",minWidth:"18px",borderRadius:"50%",
        border:`2px solid ${selected ? "#d4a017" : "rgba(255,255,255,0.2)"}`,
        display:"flex",alignItems:"center",justifyContent:"center",
        marginTop:"1px",transition:"border-color .15s",background: selected ? "rgba(212,160,23,0.15)" : "transparent"
      }}>
        {selected && <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#d4a017"}}/>}
      </div>
      <span>{label}</span>
    </label>
  );
}

// ── Select Dropdown ──
function StyledSelect({ id, value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width:"100%",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",
      padding:"12px 36px 12px 14px",fontFamily:"inherit",fontSize:"14px",
      color: value ? "#f5f0e8" : "#8a8278",background:"rgba(255,255,255,0.05)",
      outline:"none",cursor:"pointer",appearance:"none",
      backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"
    }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value} style={{background:"#1a1a2e",color:"#f5f0e8"}}>{o.label}</option>)}
    </select>
  );
}

// ── Result Dashboard ──
function ResultDashboard({ answers, result, onReset }) {
  const { finalScore, profile, profileDesc, color, recommendation, recReason, recColor, taxNote, projection, scores } = result;

  const fmt = (n) => "₹" + (n >= 10000000 ? (n/10000000).toFixed(2) + "Cr" : n >= 100000 ? (n/100000).toFixed(1) + "L" : n.toLocaleString("en-IN"));
  const scoreCategories = [
    { label: "Age & Life Stage", key: "age" },
    { label: "Time Horizon", key: "horizon" },
    { label: "Investment Mode", key: "mode" },
    { label: "Portfolio Maturity", key: "portfolio" },
    { label: "Risk Capacity", key: "risk" },
    { label: "Volatility Tolerance", key: "volatility" },
    { label: "Tax Efficiency", key: "tax" },
  ];

  return (
    <div style={{maxWidth:"760px",margin:"0 auto",padding:"0 20px 80px",animation:"fadeIn .5s ease"}}>
      {/* Header result card */}
      <div style={{
        background:"linear-gradient(135deg, rgba(212,160,23,0.12) 0%, rgba(212,160,23,0.03) 100%)",
        border:"1px solid rgba(212,160,23,0.25)",borderRadius:"16px",padding:"32px",marginBottom:"20px",
        position:"relative",overflow:"hidden"
      }}>
        <div style={{position:"absolute",top:"-40px",right:"-40px",width:"180px",height:"180px",borderRadius:"50%",background:"radial-gradient(circle,rgba(212,160,23,0.15),transparent 70%)"}}/>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#d4a017",marginBottom:"8px",fontWeight:"600"}}>Evaluation Complete</div>
        <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:"clamp(20px,4vw,28px)",color:"#f5f0e8",fontWeight:"700",marginBottom:"6px",lineHeight:"1.3"}}>{answers.q1}</div>
        <div style={{fontSize:"13px",color:"#8a8278",marginBottom:"24px"}}>Evaluated against your investor profile</div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"16px"}}>
          {/* Score */}
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"11px",color:"#8a8278",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Suitability Score</div>
            <div style={{fontSize:"42px",fontWeight:"700",color,fontFamily:"'Cormorant Garamond',serif",lineHeight:"1"}}>{finalScore}</div>
            <div style={{fontSize:"12px",color:"#8a8278",marginTop:"4px"}}>/10</div>
          </div>
          {/* Profile */}
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"11px",color:"#8a8278",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Investor Profile</div>
            <div style={{fontSize:"18px",fontWeight:"700",color,lineHeight:"1.2"}}>{profile}</div>
            <div style={{fontSize:"11px",color:"#8a8278",marginTop:"6px",lineHeight:"1.4"}}>{profileDesc.slice(0,60)}…</div>
          </div>
          {/* Recommendation */}
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"11px",color:"#8a8278",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Recommendation</div>
            <div style={{fontSize:"16px",fontWeight:"800",color:recColor,letterSpacing:"0.5px"}}>{recommendation}</div>
            <div style={{fontSize:"11px",color:"#8a8278",marginTop:"6px",lineHeight:"1.4"}}>{recReason.slice(0,60)}…</div>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",marginBottom:"20px",fontWeight:"600"}}>Score Breakdown</div>
        {scoreCategories.map(({ label, key }) => {
          const s = scores[key] || 0;
          const pct = s * 10;
          const c = s >= 8 ? "#22c55e" : s >= 6 ? "#84cc16" : s >= 4 ? "#eab308" : "#ef4444";
          return (
            <div key={key} style={{marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                <span style={{fontSize:"13px",color:"#a09890"}}>{label}</span>
                <span style={{fontSize:"13px",fontWeight:"600",color:c}}>{s}/10</span>
              </div>
              <div style={{height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${c},${c}aa)`,borderRadius:"2px",transition:"width 1s ease"}}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation detail */}
      <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${recColor}33`,borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
          <div style={{width:"10px",height:"10px",borderRadius:"50%",background:recColor,flexShrink:0,boxShadow:`0 0 8px ${recColor}`}}/>
          <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",fontWeight:"600"}}>Full Recommendation</div>
        </div>
        <div style={{fontSize:"22px",fontWeight:"800",color:recColor,marginBottom:"12px",letterSpacing:"0.5px"}}>{recommendation}</div>
        <div style={{fontSize:"14px",color:"#c8c0b4",lineHeight:"1.7"}}>{recReason}</div>
        <div style={{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:"13px",color:"#a09890",lineHeight:"1.6"}}>{profileDesc}</div>
        </div>
      </div>

      {/* SIP Projection */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",marginBottom:"20px",fontWeight:"600"}}>SIP Projection (Illustrative)</div>
        <div style={{fontSize:"12px",color:"#8a8278",marginBottom:"16px"}}>Based on ₹10,000/month SIP over {projection.horizon} years at {(projection.rate*100).toFixed(0)}% estimated CAGR</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
          {[
            { label: "Amount Invested", value: fmt(projection.invested), color: "#a09890" },
            { label: "Estimated Returns", value: fmt(projection.gains), color: "#22c55e" },
            { label: "Final Corpus", value: fmt(projection.fv), color: "#d4a017" },
          ].map(({ label, value, color: c }) => (
            <div key={label} style={{background:"rgba(0,0,0,0.2)",borderRadius:"10px",padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:"11px",color:"#8a8278",marginBottom:"8px",letterSpacing:"0.5px"}}>{label}</div>
              <div style={{fontSize:"20px",fontWeight:"700",color:c,fontFamily:"'Cormorant Garamond',serif"}}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:"12px",fontSize:"11px",color:"#6a6258",fontStyle:"italic"}}>* Illustrative only. Actual returns may vary. Not a financial guarantee.</div>
      </div>

      {/* Tax note */}
      {taxNote && (
        <div style={{background:"rgba(234,179,8,0.06)",border:"1px solid rgba(234,179,8,0.2)",borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
          <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#eab308",marginBottom:"10px",fontWeight:"600"}}>Tax Note</div>
          <div style={{fontSize:"13px",color:"#c8c0b4",lineHeight:"1.7"}}>{taxNote}</div>
        </div>
      )}

      {/* Summary answers */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"28px",marginBottom:"28px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",marginBottom:"20px",fontWeight:"600"}}>Your Responses Summary</div>
        {[
          ["Fund", answers.q1],
          ["Age", answers.q2 + " years"],
          ["Goal", answers.q3],
          ["Horizon", answers.q4 + " years"],
          ["Mode", answers.q5],
          ["Portfolio", answers.q6],
          ["Risk & Volatility", answers.q7],
          ["Tax Bracket", answers.q8?.split("—")[0].trim()],
          ["Context", answers.q9],
        ].map(([k, v]) => (
          <div key={k} style={{display:"flex",gap:"16px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{fontSize:"12px",color:"#8a8278",minWidth:"100px",flexShrink:0}}>{k}</div>
            <div style={{fontSize:"13px",color:"#c8c0b4",lineHeight:"1.4"}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"18px 20px", marginBottom:"16px" }}>
        <div style={{ fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#6a6258", fontWeight:"600", marginBottom:"8px" }}>Disclaimer</div>
        <div style={{ fontSize:"11px", color:"#6a6258", lineHeight:"1.7" }}>Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns. This evaluation is for informational purposes only and does not constitute financial advice. Please consult a SEBI-registered investment advisor before making any investment decisions.</div>
      </div>

      <button onClick={onReset} style={{
        width:"100%",background:"rgba(212,160,23,0.1)",color:"#d4a017",
        border:"1.5px solid rgba(212,160,23,0.3)",borderRadius:"10px",
        padding:"14px",fontFamily:"inherit",fontSize:"15px",fontWeight:"600",
        cursor:"pointer",transition:"all .2s",letterSpacing:"0.3px"
      }}
      onMouseEnter={e => { e.currentTarget.style.background="rgba(212,160,23,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.background="rgba(212,160,23,0.1)"; }}
      >
        ← Evaluate Another Fund
      </button>
    </div>
  );
}

// ── Questions config ──
const QUESTIONS = [
  {
    id: "q1", num: "01", title: "Fund Name",
    sub: "Search and select the mutual fund you want to evaluate.",
    type: "fundsearch",
  },
  {
    id: "q2", num: "02", title: "Your Age",
    sub: "Select your current age.",
    type: "select",
    options: Array.from({length:100},(_,i) => ({ value: String(i+1), label: `${i+1} year${i===0?"":"s"}` })),
    placeholder: "— Select your age —",
  },
  {
    id: "q3", num: "03", title: "Investment Goal",
    sub: "What is this investment for?",
    type: "radio",
    options: [
      { value: "Retirement corpus", label: "Retirement corpus" },
      { value: "Child's education or marriage", label: "Child's education or marriage" },
      { value: "Wealth creation (no specific target)", label: "Wealth creation (no specific target)" },
      { value: "Buying a home or major purchase", label: "Buying a home or major purchase" },
      { value: "Other", label: "Other — describe below" },
    ],
    hasOther: true,
  },
  {
    id: "q4", num: "04", title: "Investment Horizon",
    sub: "How many years are you willing to stay invested? Be conservative.",
    type: "select",
    options: Array.from({length:50},(_,i) => ({ value: String(i+1), label: `${i+1} year${i===0?"":"s"}` })),
    placeholder: "— Select number of years —",
  },
  {
    id: "q5", num: "05", title: "Investment Mode",
    sub: "How do you plan to invest?",
    type: "radio",
    options: [
      { value: "Lump sum only", label: "Lump sum only" },
      { value: "SIP only", label: "SIP only" },
      { value: "Both (lump sum now + ongoing SIP)", label: "Both — lump sum now + ongoing SIP" },
    ],
  },
  {
    id: "q6", num: "06", title: "Existing Portfolio",
    sub: "How would you describe your current investment portfolio?",
    type: "radio",
    options: [
      { value: "Yes — diversified portfolio of multiple funds or assets", label: "Yes — diversified portfolio of multiple funds or assets" },
      { value: "Yes — mostly in one or two funds", label: "Yes — mostly in one or two funds" },
      { value: "No — this would be my first or only equity investment", label: "No — first or only equity investment" },
      { value: "I hold primarily debt or fixed income currently", label: "I hold primarily debt or fixed income" },
    ],
  },
  {
    id: "q7", num: "07", title: "Risk & Volatility Appetite",
    sub: "How do you approach investment risk and short-term market swings?",
    type: "radio",
    options: [
      { value: "Conservative", label: "Conservative — I prioritise capital protection and prefer a smooth, stable return curve even if returns are lower" },
      { value: "Moderate", label: "Moderate — I can accept occasional dips and moderate losses as long as the long-term trend is upward" },
      { value: "Aggressive", label: "Aggressive — I am comfortable with significant drawdowns and sharp volatility if long-term compounding is strong" },
      { value: "Very Aggressive", label: "Very Aggressive — I actively seek high-risk, high-reward opportunities and can withstand extreme short-term losses" },
    ],
  },
  {
    id: "q8", num: "08", title: "Tax Sensitivity",
    sub: "Which income tax bracket are you in?",
    type: "radio",
    options: [
      { value: "30% bracket — tax efficiency matters a lot", label: "30% — tax efficiency matters a lot" },
      { value: "20% bracket — moderate concern", label: "20% — moderate concern" },
      { value: "5–10% bracket or exempt — minimal impact", label: "5–10% or exempt — minimal impact" },
      { value: "Not sure", label: "Not sure" },
    ],
  },
  {
    id: "q9", num: "09", title: "Entry Context",
    sub: "What best describes your current situation with this fund?",
    type: "radio",
    options: [
      { value: "First-time entry — considering buying", label: "First-time entry — considering buying" },
      { value: "Adding more to an existing holding", label: "Adding more to an existing holding" },
      { value: "Deciding whether to continue holding or exit", label: "Deciding whether to hold or exit" },
      { value: "Comparing against another fund I already hold", label: "Comparing against another fund I hold" },
    ],
  },
];

// ── Main App ──
export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [animDir, setAnimDir] = useState("forward");

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = (step / total) * 100;

  const getValue = (id) => {
    if (id === "q3" && answers.q3 === "Other") return otherText.trim() ? `Other: ${otherText.trim()}` : "";
    return answers[id] || "";
  };

  const isAnswered = (id) => getValue(id) !== "";

  const handleSelect = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    setError("");
  };

  const canAdvance = () => {
    const v = getValue(q.id);
    return v !== "";
  };

  const goNext = () => {
    if (!canAdvance()) { setError("Please answer this question to continue."); return; }
    setError("");
    if (step === total - 1) {
      const finalAnswers = { ...answers };
      if (answers.q3 === "Other") finalAnswers.q3 = otherText.trim() ? `Other: ${otherText.trim()}` : "Other";
      const r = scoreAnswers(finalAnswers);
      setResult({ answers: finalAnswers, ...r });
    } else {
      setAnimDir("forward");
      setStep(s => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) { setAnimDir("back"); setStep(s => s - 1); setError(""); }
  };

  const reset = () => {
    setStep(0); setAnswers({}); setOtherText(""); setError(""); setResult(null); setAnimDir("forward");
  };

  if (result) return (
    <div style={{ minHeight:"100vh", background:"#0d0d18", fontFamily:"'DM Sans', sans-serif" }}>
      <div style={{ background:"rgba(0,0,0,0.4)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"16px 40px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:"760px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", color:"#d4a017", fontWeight:"600" }}>Fund Evaluator</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", color:"#f5f0e8", fontWeight:"700" }}>Evaluation Report</div>
            <div style={{ fontSize:"11px", letterSpacing:"1.5px", color:"#a09890", marginTop:"3px" }}>By <span style={{ color:"#d4a017", fontWeight:"600" }}>Vikram Prethesh (ViP)</span></div>
          </div>
        </div>
      </div>
      <ResultDashboard answers={result.answers} result={result} onReset={reset} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d18", fontFamily:"'DM Sans', sans-serif", color:"#f5f0e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0d0d18; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInBack { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        select option { background: #1a1a2e; color: #f5f0e8; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,160,23,0.3); border-radius: 2px; }
      `}</style>

      {/* Top nav */}
      <div style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"16px 40px" }}>
        <div style={{ maxWidth:"640px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#d4a017", fontWeight:"600" }}>Investment Advisory</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", color:"#f5f0e8", fontWeight:"700", lineHeight:"1.2" }}>Mutual Fund Evaluator</div>
            <div style={{ fontSize:"11px", letterSpacing:"1.5px", color:"#a09890", marginTop:"3px" }}>Designed by <span style={{ color:"#d4a017", fontWeight:"600" }}>Vikram Prethesh (ViP)</span></div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"11px", color:"#8a8278" }}>Question</div>
            <div style={{ fontSize:"22px", fontFamily:"'Cormorant Garamond',serif", fontWeight:"700", color:"#d4a017", lineHeight:"1" }}>{step+1}<span style={{fontSize:"14px",color:"#8a8278",fontFamily:"inherit"}}>/{total}</span></div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:"2px", background:"rgba(255,255,255,0.06)" }}>
        <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#b8860b,#d4a017)", transition:"width .4s ease" }}/>
      </div>

      {/* Steps nav */}
      <div style={{ maxWidth:"640px", margin:"0 auto", padding:"20px 20px 0", display:"flex", gap:"6px" }}>
        {QUESTIONS.map((qq, i) => (
          <div key={i} style={{
            flex:1, height:"3px", borderRadius:"2px",
            background: i < step ? "#d4a017" : i === step ? "rgba(212,160,23,0.5)" : "rgba(255,255,255,0.08)",
            transition:"background .3s"
          }}/>
        ))}
      </div>

      {/* Question card */}
      <div style={{ maxWidth:"640px", margin:"0 auto", padding:"32px 20px 100px" }}>
        <div key={step} style={{ animation: `${animDir === "forward" ? "slideIn" : "slideInBack"} .35s ease` }}>
          {/* Step indicator */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"28px" }}>
            <div style={{
              width:"36px", height:"36px", borderRadius:"50%",
              background:"rgba(212,160,23,0.12)", border:"1.5px solid rgba(212,160,23,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"12px", fontWeight:"700", color:"#d4a017", letterSpacing:"0.5px"
            }}>{q.num}</div>
            <div style={{ height:"1px", flex:1, background:"rgba(212,160,23,0.15)" }}/>
          </div>

          {/* Question text */}
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,5vw,32px)", fontWeight:"700", color:"#f5f0e8", lineHeight:"1.25", marginBottom:"10px" }}>{q.title}</div>
          <div style={{ fontSize:"14px", color:"#8a8278", marginBottom:"28px", lineHeight:"1.6" }}>{q.sub}</div>

          {/* Input */}
          {q.type === "fundsearch" && (
            <FundSearch value={answers.q1 || ""} onChange={v => handleSelect("q1", v)} />
          )}

          {q.type === "select" && (
            <StyledSelect value={answers[q.id] || ""} onChange={v => handleSelect(q.id, v)} options={q.options} placeholder={q.placeholder} />
          )}

          {q.type === "radio" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {q.options.map(opt => (
                <RadioOption key={opt.value} name={q.id} value={opt.value} label={opt.label}
                  selected={answers[q.id] === opt.value}
                  onChange={v => handleSelect(q.id, v)} />
              ))}
              {q.hasOther && answers.q3 === "Other" && (
                <div style={{ marginTop:"4px", animation:"fadeIn .2s ease" }}>
                  <input
                    type="text" maxLength={100} value={otherText}
                    onChange={e => { setOtherText(e.target.value); setError(""); }}
                    placeholder="Describe your investment goal (max 100 characters)..."
                    style={{
                      width:"100%", border:"1.5px solid rgba(212,160,23,0.4)", borderRadius:"10px",
                      padding:"12px 14px", fontFamily:"inherit", fontSize:"14px",
                      color:"#f5f0e8", background:"rgba(212,160,23,0.06)", outline:"none",
                      boxSizing:"border-box"
                    }}
                    autoFocus
                  />
                  <div style={{ textAlign:"right", fontSize:"11px", color:"#8a8278", marginTop:"4px" }}>{otherText.length}/100</div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginTop:"14px", fontSize:"13px", color:"#ef4444", display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#ef4444", flexShrink:0 }}/>
              {error}
            </div>
          )}
        </div>

        {/* Answered questions recap */}
        {step > 0 && (
          <div style={{ marginTop:"36px", paddingTop:"24px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize:"11px", color:"#6a6258", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"12px" }}>Answers so far</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {QUESTIONS.slice(0, step).map((qq, i) => (
                <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", cursor:"pointer" }} onClick={() => { setAnimDir("back"); setStep(i); }}>
                  <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
                    <Check/>
                  </div>
                  <div>
                    <div style={{ fontSize:"11px", color:"#6a6258" }}>{qq.title}</div>
                    <div style={{ fontSize:"12px", color:"#a09890", marginTop:"1px" }}>{getValue(qq.id)?.slice(0,60)}{getValue(qq.id)?.length > 60 ? "…" : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:"rgba(13,13,24,0.95)", backdropFilter:"blur(20px)",
        borderTop:"1px solid rgba(255,255,255,0.06)", padding:"16px 20px"
      }}>
        <div style={{ maxWidth:"640px", margin:"0 auto", display:"flex", gap:"12px" }}>
          {step > 0 && (
            <button onClick={goBack} style={{
              display:"flex", alignItems:"center", gap:"6px",
              background:"rgba(255,255,255,0.05)", color:"#a09890",
              border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px",
              padding:"13px 20px", fontFamily:"inherit", fontSize:"14px",
              cursor:"pointer", transition:"all .2s", fontWeight:"500"
            }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
            ><ChevronLeft/> Back</button>
          )}
          <button onClick={goNext} style={{
            flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            background: canAdvance() ? "linear-gradient(135deg,#b8860b,#d4a017)" : "rgba(255,255,255,0.05)",
            color: canAdvance() ? "#0d0d18" : "#6a6258",
            border:"none", borderRadius:"10px", padding:"14px 24px",
            fontFamily:"inherit", fontSize:"15px", fontWeight:"700",
            cursor: canAdvance() ? "pointer" : "default",
            transition:"all .2s", letterSpacing:"0.3px"
          }}>
            {step === total - 1 ? "Generate Evaluation" : "Continue"}
            <ChevronRight/>
          </button>
        </div>
      </div>
    </div>
  );
}
